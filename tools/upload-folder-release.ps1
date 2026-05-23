param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [string]$Repo = "NiksheyYadav/all-of-my-projects-unveiled",
    [string]$Tag = "folder-backup-2026-05-23",
    [int]$ChunkMB = 1800,
    [string]$GhExe = "C:\Program Files\GitHub CLI\gh.exe",
    [switch]$ExcludeGenerated,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Assert-Tool {
    param([string]$ToolPath, [string]$Name)
    if (-not (Get-Command $ToolPath -ErrorAction SilentlyContinue)) {
        throw "$Name not found: $ToolPath"
    }
}

function New-SafeName {
    param([string]$Value)
    $safe = $Value -replace "^[A-Za-z]:\\", ""
    $safe = $safe -replace "[\\/]+", "__"
    $safe = $safe -replace "[^A-Za-z0-9._-]", "_"
    return $safe.Trim("_")
}

function Ensure-Release {
    param([string]$Repo, [string]$Tag, [string]$GhExe, [switch]$DryRun)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & $GhExe release view $Tag --repo $Repo 1>$null 2>$null
    $releaseViewExitCode = $LASTEXITCODE
    $ErrorActionPreference = $oldPreference

    if ($releaseViewExitCode -eq 0) {
        return
    }

    if ($DryRun) {
        Write-Host "[dry-run] create release $Tag"
        return
    }

    & $GhExe release create $Tag --repo $Repo --title "Folder backup $Tag" --notes "Chunked folder backups from C:\all projects."
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create release $Tag"
    }
}

function Upload-Asset {
    param(
        [string]$Repo,
        [string]$Tag,
        [string]$GhExe,
        [string]$FilePath,
        [switch]$DryRun
    )

    if ($DryRun) {
        Write-Host "[dry-run] upload $FilePath"
        return
    }

    & $GhExe release upload $Tag $FilePath --repo $Repo --clobber
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to upload $FilePath"
    }
}

function Join-ProcessArguments {
    param([System.Collections.Generic.List[string]]$Arguments)
    $quoted = foreach ($arg in $Arguments) {
        if ($arg -match '[\s"]') {
            '"' + ($arg -replace '"', '\"') + '"'
        } else {
            $arg
        }
    }
    return ($quoted -join " ")
}

Assert-Tool -ToolPath "tar.exe" -Name "tar"
Assert-Tool -ToolPath $GhExe -Name "GitHub CLI"

$resolved = (Resolve-Path -LiteralPath $Path).Path
if (-not (Test-Path -LiteralPath $resolved -PathType Container)) {
    throw "Path is not a folder: $resolved"
}

$parent = Split-Path -Parent $resolved
$folder = Split-Path -Leaf $resolved
$relative = $resolved
try {
    $relative = Resolve-Path -LiteralPath $resolved -Relative
} catch {
    $relative = $folder
}

$safeName = New-SafeName -Value $relative
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("github-folder-backup-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempDir | Out-Null

$manifestPath = Join-Path $tempDir "$safeName.manifest.sha256.txt"
$chunkBytes = [int64]$ChunkMB * 1MB
$buffer = New-Object byte[] (4MB)
$part = 1
$currentBytes = [int64]0
$chunkPath = $null
$chunkStream = $null
$uploaded = @()

function New-ChunkStream {
    param([int]$Part, [string]$TempDir, [string]$SafeName)
    $name = "{0}.tar.part-{1:D5}" -f $SafeName, $Part
    $path = Join-Path $TempDir $name
    $stream = [System.IO.File]::Open($path, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
    return @{ Path = $path; Stream = $stream }
}

function Close-And-UploadChunk {
    param(
        [string]$ChunkPath,
        [System.IO.Stream]$ChunkStream,
        [string]$ManifestPath,
        [string]$Repo,
        [string]$Tag,
        [string]$GhExe,
        [switch]$DryRun
    )

    if ($null -eq $ChunkPath -or $null -eq $ChunkStream) {
        return
    }

    $ChunkStream.Flush()
    $ChunkStream.Dispose()
    $hash = (Get-FileHash -LiteralPath $ChunkPath -Algorithm SHA256).Hash.ToLowerInvariant()
    $size = (Get-Item -LiteralPath $ChunkPath).Length
    $line = "$hash  $(Split-Path -Leaf $ChunkPath)  $size"
    Add-Content -LiteralPath $ManifestPath -Value $line
    Upload-Asset -Repo $Repo -Tag $Tag -GhExe $GhExe -FilePath $ChunkPath -DryRun:$DryRun
    Remove-Item -LiteralPath $ChunkPath -Force
}

try {
    Ensure-Release -Repo $Repo -Tag $Tag -GhExe $GhExe -DryRun:$DryRun

    $tarArgs = New-Object System.Collections.Generic.List[string]
    if ($ExcludeGenerated) {
        foreach ($pattern in @(
            "node_modules",
            "venv",
            ".venv",
            "env",
            "myenv",
            "__pycache__",
            ".pytest_cache",
            ".ipynb_checkpoints",
            ".next",
            "dist",
            "build",
            "coverage",
            "logs",
            "tmp",
            "temp",
            "cache",
            "Cache",
            ".cache"
        )) {
            [void]$tarArgs.Add("--exclude=$pattern")
        }
    }
    foreach ($arg in @("-cf", "-", "-C", $parent, $folder)) {
        [void]$tarArgs.Add($arg)
    }

    Write-Host "Streaming $resolved to release $Repo/$Tag"
    Write-Host "Chunk size: $ChunkMB MB"

    $psi = [System.Diagnostics.ProcessStartInfo]::new("tar.exe")
    $psi.Arguments = Join-ProcessArguments -Arguments $tarArgs
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.UseShellExecute = $false

    $process = [System.Diagnostics.Process]::Start($psi)
    $tarStream = $process.StandardOutput.BaseStream

    $chunk = New-ChunkStream -Part $part -TempDir $tempDir -SafeName $safeName
    $chunkPath = $chunk.Path
    $chunkStream = $chunk.Stream

    while (($read = $tarStream.Read($buffer, 0, $buffer.Length)) -gt 0) {
        $offset = 0
        while ($offset -lt $read) {
            $remainingInChunk = $chunkBytes - $currentBytes
            $toWrite = [Math]::Min($remainingInChunk, $read - $offset)
            $chunkStream.Write($buffer, $offset, $toWrite)
            $offset += $toWrite
            $currentBytes += $toWrite

            if ($currentBytes -ge $chunkBytes) {
                Close-And-UploadChunk -ChunkPath $chunkPath -ChunkStream $chunkStream -ManifestPath $manifestPath -Repo $Repo -Tag $Tag -GhExe $GhExe -DryRun:$DryRun
                $uploaded += (Split-Path -Leaf $chunkPath)
                $part++
                $currentBytes = 0
                $chunk = New-ChunkStream -Part $part -TempDir $tempDir -SafeName $safeName
                $chunkPath = $chunk.Path
                $chunkStream = $chunk.Stream
            }
        }
    }

    $process.WaitForExit()
    $stderr = $process.StandardError.ReadToEnd()
    if ($process.ExitCode -ne 0) {
        throw "tar failed with exit code $($process.ExitCode): $stderr"
    }

    if ($currentBytes -gt 0) {
        Close-And-UploadChunk -ChunkPath $chunkPath -ChunkStream $chunkStream -ManifestPath $manifestPath -Repo $Repo -Tag $Tag -GhExe $GhExe -DryRun:$DryRun
        $uploaded += (Split-Path -Leaf $chunkPath)
        $chunkStream = $null
        $chunkPath = $null
    } else {
        if ($null -ne $chunkStream) {
            $chunkStream.Dispose()
        }
        if ($null -ne $chunkPath -and (Test-Path -LiteralPath $chunkPath)) {
            Remove-Item -LiteralPath $chunkPath -Force
        }
    }

    Add-Content -LiteralPath $manifestPath -Value ""
    Add-Content -LiteralPath $manifestPath -Value "restore_command=copy /b $safeName.tar.part-* $safeName.tar && tar -xf $safeName.tar"
    Upload-Asset -Repo $Repo -Tag $Tag -GhExe $GhExe -FilePath $manifestPath -DryRun:$DryRun

    Write-Host "Uploaded $($uploaded.Count) chunk(s) plus manifest for $resolved"
} finally {
    if ($null -ne $chunkStream) {
        $chunkStream.Dispose()
    }
    if (Test-Path -LiteralPath $tempDir) {
        Remove-Item -LiteralPath $tempDir -Recurse -Force
    }
}
