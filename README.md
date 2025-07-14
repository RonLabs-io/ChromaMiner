# Chroma Viewer

An Electron application for viewing and managing ChromaDB databases with automatic port detection and cross-platform builds.

## Features

- Connect to ChromaDB databases
- View collections and documents
- Modern and responsive interface
- Multiple instance support
- Automatic port detection
- Cross-platform builds (Linux, Windows, macOS)
- AppImage support for Linux

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Scripts

The application supports **dynamic port detection**, automatically finding the next available port:

#### 1. Automatic Development (Recommended)
```bash
npm run electron:dev:auto
```
- Automatically finds the next available port
- Starts Next.js server and Electron automatically
- No manual configuration required

#### 2. Legacy Development (Fixed Port)
```bash
npm run electron:dev
```
- Uses fixed port 3000
- Requires port 3000 to be available

#### 3. Manual Dynamic Development
```bash
npm run electron:dev:dynamic
```
- Uses dynamic port with wait-on
- More complex but allows more control

## Build & Distribution

### Production Builds

The application now supports automatic port detection in production builds, ensuring reliable deployment across different environments.

#### Build Commands

```bash
# Production build with automatic port detection
npm run electron:build

# Linux-specific build
npm run electron:build:linux

# AppImage creation with port conflict resolution
npm run appimage:build

# Package without build (uses existing build)
npm run electron:pack
```

#### Build Features

- **Automatic Port Detection**: Production builds find available ports automatically
- **Cross-Platform Compatibility**: Improved build process for Linux, Windows, and macOS
- **AppImage Support**: Enhanced AppImage generation with dynamic port handling
- **Standalone Builds**: Better handling of standalone builds with port management

### Build Process

1. **Port Detection**: Build process finds available port starting from 3000
2. **Server Initialization**: Next.js server starts on detected port
3. **Electron Launch**: Electron app connects to the correct port
4. **Fallback Handling**: Automatic fallback if port detection fails

### Build Benefits

- ✅ **No Port Conflicts**: Production builds work regardless of port availability
- ✅ **Consistent Deployment**: Same build works across different environments
- ✅ **AppImage Reliability**: AppImage builds handle port conflicts automatically
- ✅ **Cross-Platform**: Builds work consistently on all platforms
- ✅ **Backward Compatibility**: Existing builds continue to work

## How Dynamic Port Detection Works

1. **Development**: The `start-dev.js` script finds the next available port starting from 3000
2. **Production**: The `electron-main.js` automatically finds an available port
3. **Communication**: The port is saved in a temporary `.port` file for synchronization

### Advantages of Dynamic Port Detection

- ✅ Avoids port conflicts
- ✅ Allows multiple instances
- ✅ Works in environments with occupied ports
- ✅ Automatic and transparent

## Project Structure

```
chroma_viewer/
├── app/                 # Next.js app router
├── components/          # React components
├── lib/                # Utilities and configurations
├── scripts/            # Development and build scripts
├── electron-main.js    # Electron main process
├── electron-builder.json # Build configuration
└── package.json        # Project configuration
```

## Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **Desktop**: Electron
- **UI**: Tailwind CSS, Lucide React
- **Database**: ChromaDB
- **Build**: Electron Builder

## Build Compatibility

- ✅ **Linux AppImage**: Enhanced AppImage generation
- ✅ **Linux Unpacked**: Improved unpacked build process
- ✅ **Development**: New dev scripts don't affect production builds
- ✅ **Legacy Builds**: Existing build commands still work

## Troubleshooting

### Build Issues

If you encounter build issues:

```bash
# Clean build files
npm run clean

# Rebuild
npm run electron:build
```

### Port Conflicts

The application automatically handles port conflicts, but if you need to specify a port:

```bash
# Set custom port (development only)
PORT=3001 npm run electron:dev:auto
```

### AppImage Issues

For AppImage generation issues:

```bash
# Make AppImage executable
chmod +x "release/Chroma Miner-0.1.0.AppImage"

# Run AppImage
./release/Chroma\ Miner-0.1.0.AppImage
```

## License

MIT

## Author

Ronald Lopes 