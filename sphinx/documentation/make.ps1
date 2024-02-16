# PowerShell equivalent of the batch script
$SPHINXBUILD = $env:SPHINXBUILD

if (-not $SPHINXBUILD) {
    $SPHINXBUILD = "sphinx-build"
}

$SOURCEDIR = "source"
$BUILDDIR = "build"

if ($SPHINXBUILD -eq $null) {
    Write-Host ""
    Write-Host "The 'sphinx-build' command was not found. Make sure you have Sphinx"
    Write-Host "installed, then set the SPHINXBUILD environment variable to point"
    Write-Host "to the full path of the 'sphinx-build' executable. Alternatively you"
    Write-Host "may add the Sphinx directory to PATH."
    Write-Host ""
    Write-Host "If you don't have Sphinx installed, grab it from"
    Write-Host "https://www.sphinx-doc.org/"
    exit 1
}

if ($args.Count -eq 0) {
    & $SPHINXBUILD -M help $SOURCEDIR $BUILDDIR $SPHINXOPTS $O
} else {
    & $SPHINXBUILD -M $args[0] $SOURCEDIR $BUILDDIR $SPHINXOPTS $O
}
