param(
    [string]$Repo = "NiksheyYadav/all-of-my-projects-unveiled",
    [string]$Tag = "folder-backup-2026-05-23",
    [int]$ChunkMB = 500
)

$ErrorActionPreference = "Stop"
$uploader = Join-Path $PSScriptRoot "upload-folder-release.ps1"
$workspace = Split-Path -Parent $PSScriptRoot

$folders = @(
    "alg",
    "CG-casestudy",
    "cyber_research",
    "dcai",
    "dv_research",
    "Dyple",
    "githubstats-readme-master",
    "mediverse",
    "mri",
    "pl"
)

foreach ($folder in $folders) {
    Write-Host "=== Uploading $folder ==="
    $uploadParams = @{
        Path = Join-Path $workspace $folder
        Repo = $Repo
        Tag = $Tag
        ChunkMB = $ChunkMB
        UploadRetries = 6
        RetryDelaySeconds = 30
        UseCurlUpload = $true
        ResumeExisting = $true
        ExcludeGenerated = $true
    }
    & $uploader @uploadParams
}
