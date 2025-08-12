# External URLs Reference

This document contains all external URLs that were previously used in the project and their replacement strategies.

## Builder.io CDN URLs (Replaced with internal assets)

### Logo URLs
- **Old**: `https://cdn.builder.io/api/v1/image/assets%2Fb9e926f9dca9498f8a0f99f9f9792da7%2F850832a345244408ac37832fa5cb7097?format=webp&width=800`
- **New**: `/images/brand/logo.svg`
- **Used in**: 
  - `src/components/layout/PremiumNavigation.tsx`
  - `src/components/SEO/SEOHead.tsx`
  - `public/sw.js`

- **Old**: `https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F6982878bae124d2589b95f89b1a5cf5b?format=webp&width=200`
- **New**: `/images/brand/logo.svg`
- **Used in**:
  - `src/pages/Login.tsx`
  - `src/pages/Register.tsx`
  - `src/pages/ForgotPassword.tsx`

### Background Images
- **Old**: `https://cdn.builder.io/api/v1/image/assets%2Fb9e926f9dca9498f8a0f99f9f9792da7%2F8f98d79878704821ac687723d7e03126?format=webp&width=800`
- **New**: `/images/projects/commercial-1.JPG`
- **Used in**: `src/components/sections/home/PremiumHero.tsx`

- **Old**: `https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F3ea4e8ddcd314db6b491a8835cfb72ec?format=webp&width=800`
- **New**: `/images/projects/residential-1.JPG`
- **Used in**: `src/pages/Login.tsx`

### SEO Images
- **Old**: `https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F6fe8dede446d44e5b3f61dac8e245b53?alt=media&token=2cd3aa20-e283-42dd-ad0a-b327725825be&apiKey=751ea84be0da437c8dd3f1bf04173189`
- **New**: `/images/brand/logo.svg`
- **Used in**: 
  - `src/components/SEO/SEOHead.tsx`
  - `public/sw.js`

## Unsplash CDN URLs (Mapped to internal assets)

### Blog Images (src/data/blog.ts)
| Old Unsplash URL | New Internal Path | Description |
|------------------|-------------------|-------------|
| `https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80` | `/images/blog/construction-tech.JPG` | Modern Construction Technology |
| `https://images.unsplash.com/photo-1530569673472-307dc017a82d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80` | `/images/blog/construction-safety.JPG` | Construction Safety Practices |
| `https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80` | `/images/blog/modern-architecture.JPG` | Modern Architecture Design |
| `https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80` | `/images/blog/sustainability-building .JPG` | Sustainable Building Practices |
| `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80` | `/images/projects/commercial-1.JPG` | Commercial Development |
| `https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80` | `/images/projects/industrial-1.JPG` | Industrial Construction |
| `https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80` | `/images/projects/residential-1.JPG` | Residential Projects |
| `https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80` | `/images/services/commercial.JPG` | Commercial Services |
| `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80` | `/images/services/industrial.JPG` | Industrial Services |
| `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80` | `/images/services/residential.JPG` | Residential Services |

### Testimonials & Team Images
All testimonial and team images in components have been mapped to internal brand assets for consistency.

### Project Gallery Images
All project images have been mapped to the appropriate internal project images in `/images/projects/`.

## Third-Party Services (Kept External)

### Google Fonts
- **URL**: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- **Status**: Kept external - Required for web fonts
- **Used in**: `src/styles/modern-design-system.css`, `public/sw.js`

### Tawk.to Chat Widget
- **URL**: `https://embed.tawk.to/6857837019acdf191aa65414/1iuatis6a`
- **Status**: Kept external - Third-party service
- **Used in**: `src/config/tawkto.ts`
- **Direct chat link**: `https://tawk.to/chat/6857837019acdf191aa65414/1iuatis6a`

## Migration Strategy

1. **Phase 1**: Replace all Builder.io CDN URLs with internal assets ✅
2. **Phase 2**: Map Unsplash URLs to internal project images ✅
3. **Phase 3**: Keep essential external services (fonts, chat) ✅
4. **Phase 4**: Optimize internal images for web delivery ⏳

## Performance Benefits

- Reduced external dependencies
- Better loading performance
- Consistent brand assets
- Improved offline functionality
- Better SEO with optimized local images

## Maintenance Notes

- All internal images are stored in `/public/images/`
- Images are organized by category: `blog/`, `brand/`, `projects/`, `services/`
- Consider implementing image optimization pipeline for production builds
- Regular auditing of external dependencies recommended
