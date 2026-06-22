param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [string]$Repo = "NiksheyYadav/all-of-my-projects-unveiled",
    [string]$Tag = "folder-backup-2026-05-23",
    [int]$ChunkMB = 1800,
    [string]$GhExe = "C:\Program Files\GitHub CLI\gh.exe",
    [int]$UploadRetries = 5,
    [int]$RetryDelaySeconds = 20,
    [switch]$UseCurlUpload,
    [switch]$ResumeExisting,
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
    $safe = $safe.Trim("_")
    if ($safe.StartsWith(".")) {
        $safe = "default" + $safe
    }
    return $safe
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

function Get-RepoParts {
    param([string]$Repo)
    $parts = $Repo.Split("/", 2)
    if ($parts.Count -ne 2) {
        throw "Repo must be in OWNER/NAME format: $Repo"
    }
    return @{ Owner = $parts[0]; Name = $parts[1] }
}

function Get-GitHubToken {
    param([string]$GhExe)
    if ($script:CachedGitHubToken) {
        return $script:CachedGitHubToken
    }

    $token = (& $GhExe auth token).Trim()
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($token)) {
        throw "Could not read GitHub token from gh auth token"
    }

    $script:CachedGitHubToken = $token
    return $script:CachedGitHubToken
}

function New-CurlConfigFile {
    param([string]$Token)
    $path = [System.IO.Path]::GetTempFileName()
    @(
        'header = "Accept: application/vnd.github+json"',
        ('header = "Authorization: Bearer ' + $Token + '"'),
        'header = "X-GitHub-Api-Version: 2022-11-28"'
    ) | Set-Content -LiteralPath $path -Encoding ASCII
    return $path
}

function Invoke-GitHubCurlJson {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [string]$GhExe
    )

    $token = Get-GitHubToken -GhExe $GhExe
    $config = New-CurlConfigFile -Token $token
    $output = [System.IO.Path]::GetTempFileName()
    try {
        & curl.exe -4 -fsSL --retry 3 --retry-delay 5 --retry-all-errors --connect-timeout 30 -X $Method --config $config -o $output $Url
        if ($LASTEXITCODE -ne 0) {
            throw "curl request failed for $Url"
        }
        $raw = Get-Content -LiteralPath $output -Raw
        if ([string]::IsNullOrWhiteSpace($raw)) {
            return $null
        }
        return ($raw | ConvertFrom-Json)
    } finally {
        Remove-Item -LiteralPath $config,$output -Force -ErrorAction SilentlyContinue
    }
}

function Get-ReleaseIdCurl {
    param([string]$Repo, [string]$Tag, [string]$GhExe)
    if ($script:CachedReleaseId) {
        return $script:CachedReleaseId
    }

    $parts = Get-RepoParts -Repo $Repo
    $escapedTag = [System.Uri]::EscapeDataString($Tag)
    $url = "https://api.github.com/repos/$($parts.Owner)/$($parts.Name)/releases/tags/$escapedTag"
    $release = Invoke-GitHubCurlJson -Url $url -GhExe $GhExe
    if (-not $release -or -not $release.id) {
        throw "Could not get release id for $Repo tag $Tag"
    }

    $script:CachedReleaseId = [string]$release.id
    return $script:CachedReleaseId
}

function Find-ReleaseAssetCurl {
    param([string]$Repo, [string]$ReleaseId, [string]$AssetName, [string]$GhExe)
    $parts = Get-RepoParts -Repo $Repo
    for ($page = 1; $page -le 20; $page++) {
        $url = "https://api.github.com/repos/$($parts.Owner)/$($parts.Name)/releases/$ReleaseId/assets?per_page=100&page=$page"
        $assets = Invoke-GitHubCurlJson -Url $url -GhExe $GhExe
        if (-not $assets -or $assets.Count -eq 0) {
            return $null
        }

        foreach ($asset in $assets) {
            if ($asset.name -eq $AssetName) {
                return $asset
            }
        }
    }
    return $null
}

function Upload-AssetWithCurl {
    param(
        [string]$Repo,
        [string]$Tag,
        [string]$GhExe,
        [string]$FilePath,
        [string]$LocalSha256,
        [switch]$ResumeExisting
    )

    $parts = Get-RepoParts -Repo $Repo
    $releaseId = Get-ReleaseIdCurl -Repo $Repo -Tag $Tag -GhExe $GhExe
    $assetName = Split-Path -Leaf $FilePath
    $existing = Find-ReleaseAssetCurl -Repo $Repo -ReleaseId $releaseId -AssetName $assetName -GhExe $GhExe

    if ($ResumeExisting -and $existing -and $existing.digest -and $LocalSha256) {
        if ($existing.digest.ToLowerInvariant() -eq ("sha256:" + $LocalSha256.ToLowerInvariant())) {
            Write-Host "Verified existing asset, skipping upload: $assetName"
            return
        }
    }

    if ($existing -and $existing.id) {
        $deleteUrl = "https://api.github.com/repos/$($parts.Owner)/$($parts.Name)/releases/assets/$($existing.id)"
        [void](Invoke-GitHubCurlJson -Url $deleteUrl -Method "DELETE" -GhExe $GhExe)
    }

    $token = Get-GitHubToken -GhExe $GhExe
    $config = New-CurlConfigFile -Token $token
    $response = [System.IO.Path]::GetTempFileName()
    try {
        $escapedAssetName = [System.Uri]::EscapeDataString($assetName)
        $uploadUrl = "https://uploads.github.com/repos/$($parts.Owner)/$($parts.Name)/releases/$releaseId/assets?name=$escapedAssetName"
        & curl.exe -4 -sS --fail-with-body --retry 5 --retry-delay 10 --retry-all-errors --connect-timeout 30 --max-time 1200 -X POST --config $config -H "Content-Type: application/octet-stream" --data-binary "@$FilePath" -o $response $uploadUrl
        if ($LASTEXITCODE -ne 0) {
            throw "curl upload failed for $FilePath"
        }
    } finally {
        Remove-Item -LiteralPath $config,$response -Force -ErrorAction SilentlyContinue
    }
}

function Upload-Asset {
    param(
        [string]$Repo,
        [string]$Tag,
        [string]$GhExe,
        [string]$FilePath,
        [int]$UploadRetries,
        [int]$RetryDelaySeconds,
        [switch]$UseCurlUpload,
        [string]$LocalSha256,
        [switch]$ResumeExisting,
        [switch]$DryRun
    )

    if ($DryRun) {
        Write-Host "[dry-run] upload $FilePath"
        return
    }

    for ($attempt = 1; $attempt -le $UploadRetries; $attempt++) {
        try {
            if ($UseCurlUpload) {
                Upload-AssetWithCurl -Repo $Repo -Tag $Tag -GhExe $GhExe -FilePath $FilePath -LocalSha256 $LocalSha256 -ResumeExisting:$ResumeExisting
            } else {
                & $GhExe release upload $Tag $FilePath --repo $Repo --clobber
                if ($LASTEXITCODE -ne 0) {
                    throw "gh release upload failed for $FilePath"
                }
            }
            return
        } catch {
            if ($attempt -ge $UploadRetries) {
                throw "Failed to upload $FilePath after $UploadRetries attempt(s): $($_.Exception.Message)"
            }
            Write-Warning "Upload failed for $FilePath. Retrying attempt $($attempt + 1)/$UploadRetries in $RetryDelaySeconds seconds."
            Start-Sleep -Seconds $RetryDelaySeconds
        }
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

function Get-Sha256Hex {
    param([string]$FilePath)
    $stream = [System.IO.File]::OpenRead($FilePath)
    try {
        $sha256 = [System.Security.Cryptography.SHA256]::Create()
        try {
            $bytes = $sha256.ComputeHash($stream)
            return (($bytes | ForEach-Object { $_.ToString("x2") }) -join "")
        } finally {
            $sha256.Dispose()
        }
    } finally {
        $stream.Dispose()
    }
}

Assert-Tool -ToolPath "tar.exe" -Name "tar"
Assert-Tool -ToolPath $GhExe -Name "GitHub CLI"
if ($UseCurlUpload) {
    Assert-Tool -ToolPath "curl.exe" -Name "curl"
}

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
        [int]$UploadRetries,
        [int]$RetryDelaySeconds,
        [switch]$UseCurlUpload,
        [switch]$ResumeExisting,
        [switch]$DryRun
    )

    if ($null -eq $ChunkPath -or $null -eq $ChunkStream) {
        return
    }

    $ChunkStream.Flush()
    $ChunkStream.Dispose()
    $hash = Get-Sha256Hex -FilePath $ChunkPath
    $size = (Get-Item -LiteralPath $ChunkPath).Length
    $line = "$hash  $(Split-Path -Leaf $ChunkPath)  $size"
    Add-Content -LiteralPath $ManifestPath -Value $line
    Upload-Asset -Repo $Repo -Tag $Tag -GhExe $GhExe -FilePath $ChunkPath -UploadRetries $UploadRetries -RetryDelaySeconds $RetryDelaySeconds -UseCurlUpload:$UseCurlUpload -LocalSha256 $hash -ResumeExisting:$ResumeExisting -DryRun:$DryRun
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
            "skills",
            ".claude/skills",
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
                Close-And-UploadChunk -ChunkPath $chunkPath -ChunkStream $chunkStream -ManifestPath $manifestPath -Repo $Repo -Tag $Tag -GhExe $GhExe -UploadRetries $UploadRetries -RetryDelaySeconds $RetryDelaySeconds -UseCurlUpload:$UseCurlUpload -ResumeExisting:$ResumeExisting -DryRun:$DryRun
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
        Close-And-UploadChunk -ChunkPath $chunkPath -ChunkStream $chunkStream -ManifestPath $manifestPath -Repo $Repo -Tag $Tag -GhExe $GhExe -UploadRetries $UploadRetries -RetryDelaySeconds $RetryDelaySeconds -UseCurlUpload:$UseCurlUpload -ResumeExisting:$ResumeExisting -DryRun:$DryRun
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
    $manifestHash = Get-Sha256Hex -FilePath $manifestPath
    Upload-Asset -Repo $Repo -Tag $Tag -GhExe $GhExe -FilePath $manifestPath -UploadRetries $UploadRetries -RetryDelaySeconds $RetryDelaySeconds -UseCurlUpload:$UseCurlUpload -LocalSha256 $manifestHash -ResumeExisting:$ResumeExisting -DryRun:$DryRun

    Write-Host "Uploaded $($uploaded.Count) chunk(s) plus manifest for $resolved"
} finally {
    if ($null -ne $chunkStream) {
        $chunkStream.Dispose()
    }
    if (Test-Path -LiteralPath $tempDir) {
        Remove-Item -LiteralPath $tempDir -Recurse -Force
    }
}
