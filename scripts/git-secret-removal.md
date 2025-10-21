# Git history secret removal helper

1. Find occurrences in the working tree (PowerShell):

```powershell
.\find-secret.ps1 -Token '<SECRET_SUBSTRING>'
```

2. If commits contain the secret, prepare `replacements.txt` with the exact secret mapping:

Create `replacements.txt` containing a single line:

```text
<EXACT_SECRET_STRING>==>REDACTED_SERVICE_ROLE_KEY
```

3. Use git-filter-repo (recommended):

```bash
# Clone a mirror
git clone --mirror https://github.com/<owner>/<repo>.git
cd <repo>.git
# Copy replacements.txt into the repo.git parent folder
git filter-repo --replace-text ../replacements.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

4. Alternative: BFG Repo Cleaner

```bash
java -jar bfg.jar --replace-text replacements.txt repo.git
cd repo.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

Notes:

- Rewriting history is destructive. Coordinate with collaborators; they'll need to re-clone.
- Never paste secrets to public places; run these commands in a secure environment.
Git history secret removal helper

1) Find occurrences in working tree (PowerShell):

```powershell
.\ind-secret.ps1 -Token '<SECRET_SUBSTRING>'
```

2) If commits contain the secret, prepare replacements.txt with the exact secret mapping:

Create `replacements.txt` containing a single line:

```
<EXACT_SECRET_STRING>==>REDACTED_SERVICE_ROLE_KEY
```

3) Use git-filter-repo (recommended):

```bash
# Clone a mirror
git clone --mirror https://github.com/<owner>/<repo>.git
cd <repo>.git
# Copy replacements.txt into the repo.git parent folder
git filter-repo --replace-text ../replacements.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

4) Alternative: BFG Repo Cleaner

```bash
java -jar bfg.jar --replace-text replacements.txt repo.git
cd repo.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

Notes:
- Rewriting history is destructive. Coordinate with collaborators; they'll need to re-clone.
- Never paste secrets to public places; run these commands in a secure environment.
