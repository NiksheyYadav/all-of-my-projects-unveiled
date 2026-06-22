# Cleanup Script - Remove Downloaded Models

# Remove Hugging Face cache (frees up 15-20GB)
Write-Host "Removing Hugging Face model cache..."
$cachePath = "$env:USERPROFILE\.cache\huggingface"

if (Test-Path $cachePath) {
    $size = (Get-ChildItem $cachePath -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB
    Write-Host "Found cache: $([math]::Round($size, 2)) GB"
    
    Remove-Item -Path $cachePath -Recurse -Force
    Write-Host "✅ Removed Hugging Face cache"
} else {
    Write-Host "No cache found at $cachePath"
}

# Also remove offload folder if it exists
if (Test-Path ".\offload") {
    Remove-Item -Path ".\offload" -Recurse -Force
    Write-Host "✅ Removed offload folder"
}

Write-Host "`nCleanup complete! Space freed."
