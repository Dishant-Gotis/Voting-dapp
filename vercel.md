# Deploying BlockVote to Vercel

This guide provides step-by-step instructions for deploying the Blockchain Voting DApp frontend to Vercel.

## Prerequisites

Before deploying, ensure you have:

1. A [Vercel account](https://vercel.com/signup) (free tier available)
2. A [GitHub account](https://github.com) with your project repository
3. The smart contract deployed to your target Ethereum network
4. Node.js 18+ installed locally (for testing)

## Step 1: Prepare Your Repository

### 1.1 Push Your Code to GitHub

If you haven't already, initialize a git repository and push your code:

```bash
cd voting-dapp
git init
git add .
git commit -m "Initial commit: BlockVote DApp"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/voting-dapp.git
git push -u origin main
```

### 1.2 Create Environment Variables File

Create a `.env.local` file for local development (this file should NOT be committed):

```bash
# .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```

Create a `.env.example` file to document required variables:

```bash
# .env.example
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

## Step 2: Deploy Smart Contract

Before deploying the frontend, you need to deploy the smart contract.

### Using Truffle (Original Setup)

```bash
cd Voting-dapp
truffle compile
truffle migrate --network <network_name>
```

### Using Hardhat (Alternative)

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

**Save the deployed contract address** - you'll need it for the environment variables.

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"

2. **Import Repository**
   - Connect your GitHub account if not already connected
   - Select your `voting-dapp` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Add Environment Variables**
   - Expand "Environment Variables" section
   - Add the following variable:
   
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0xYourDeployedContractAddress` |

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd voting-dapp
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name: `voting-dapp` (or your preferred name)
   - Directory: `./`
   - Override settings? `N`

5. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
   ```
   Enter the value when prompted.

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 4: Configure Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### DNS Configuration

Add the following records to your domain's DNS:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

## Step 5: Verify Deployment

1. **Access your deployed site**
   - Production: `https://your-project.vercel.app`
   - Preview: Check deployment URL in Vercel dashboard

2. **Test functionality**
   - Open the site in a browser with MetaMask installed
   - Connect your wallet
   - Verify the contract address is correct
   - Test voting functionality on testnet first

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed Election contract address | Yes |

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

### Branch Configuration

To customize deployment branches:

1. Go to Project Settings → Git
2. Configure Production Branch
3. Set up preview deployments as needed

## Troubleshooting

### Build Fails

1. **Check Node.js version**
   - Ensure you're using Node.js 18+
   - Add to `package.json`:
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

2. **Check dependencies**
   ```bash
   npm install
   npm run build
   ```

3. **View build logs**
   - Go to Vercel Dashboard → Deployments
   - Click on the failed deployment
   - View "Build Logs"

### Contract Connection Issues

1. **Verify contract address**
   - Check the environment variable is set correctly
   - Ensure the contract is deployed on the correct network

2. **Check network**
   - Make sure users are connected to the correct Ethereum network
   - The frontend will display network name when connected

### MetaMask Issues

1. **Clear MetaMask cache**
   - Settings → Advanced → Clear activity tab data

2. **Reset account**
   - Settings → Advanced → Reset Account

## Production Checklist

Before going live, ensure:

- [ ] Smart contract deployed to mainnet/production network
- [ ] Contract address environment variable updated
- [ ] All candidates and voters added
- [ ] Admin wallet secured
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Test all functionality on production

## Useful Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Start production build locally
npm run start

# Deploy to Vercel (preview)
vercel

# Deploy to Vercel (production)
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)

## Support

If you encounter issues:
1. Check [Vercel Status](https://vercel-status.com/)
2. Review [Vercel Guides](https://vercel.com/guides)
3. Join [Vercel Discord](https://vercel.com/discord)

---

Happy deploying! 🚀
