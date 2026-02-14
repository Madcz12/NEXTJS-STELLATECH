
Write-Host "Cleaning up Prisma folders..."
if (Test-Path "node_modules\@prisma") { Remove-Item -Recurse -Force "node_modules\@prisma" }
if (Test-Path "node_modules\prisma") { Remove-Item -Recurse -Force "node_modules\prisma" }
if (Test-Path "node_modules\.prisma") { Remove-Item -Recurse -Force "node_modules\.prisma" }
Write-Host "Cleanup done."
