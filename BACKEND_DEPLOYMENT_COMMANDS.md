# Backend Deployment Commands

To push only the backend to the new repository at `https://github.com/Aladdin011/Jdback.git`, follow these steps:

## Method 1: Using Git Subtree (Recommended)

```bash
# From the root directory of your project
git subtree push --prefix=backend https://github.com/Aladdin011/Jdback.git main
```

## Method 2: Manual Copy and Push

```bash
# Create a temporary directory
mkdir temp-backend-repo
cd temp-backend-repo

# Copy backend files
cp -r ../backend/* .

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial backend setup for JD Marc"

# Add remote origin
git remote add origin https://github.com/Aladdin011/Jdback.git

# Set branch to main
git branch -M main

# Push to remote repository
git push -u origin main

# Clean up (go back to original directory)
cd ..
rm -rf temp-backend-repo
```

## Method 3: Using GitHub CLI (if available)

```bash
# From the backend directory
cd backend
gh repo create Aladdin011/Jdback --public
git init
git add .
git commit -m "Initial backend setup for JD Marc"
git remote add origin https://github.com/Aladdin011/Jdback.git
git branch -M main
git push -u origin main
```

## Verification

After pushing, verify the repository at:
https://github.com/Aladdin011/Jdback

The repository should contain:
- package.json
- tsconfig.json
- src/ directory with all backend code
- README.md
- .env.example

## Next Steps

1. Update any CI/CD configurations to point to the new repository
2. Update deployment configurations in Render to use the new repository
3. Update documentation references to the new backend repository
