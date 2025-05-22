# Sylo - Design Studio Productivity App

Sylo is a comprehensive productivity application designed specifically for design studios, combining AI assistance, project management, and Google Workspace integration.

## Features

- AI-powered chat interface for design and productivity assistance
- Project and task management with dependencies and timelines
- Google Workspace integration (Calendar, Drive)
- Team collaboration tools
- Customizable AI behavior through user and team settings
- Voice mode for hands-free interaction

## Implementation Status

The project is currently in Phase 1 development. See [ROADMAP.md](./docs/ROADMAP.md) for detailed progress tracking.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System architecture and components
- [Development Guide](./docs/DEVELOPMENT.md) - Setup and development instructions
- [Roadmap](./docs/ROADMAP.md) - Development phases and progress tracking
- [Product Requirements](./docs/PRD.md) - Product requirements and specifications
- [Changelog](./docs/CHANGELOG.md) - Version history and changes

## MCP Servers

Sylo uses Model Context Protocol (MCP) servers to extend AI assistant capabilities:

1. **Google Drive MCP Server** - Allows AI assistants to interact with Google Drive files and folders
2. **Supabase MCP Server** - Allows AI assistants to interact with Supabase projects, databases, and edge functions

For more information on MCP servers, see the [mcp-servers/README.md](./mcp-servers/README.md) file.

## Getting Started

1. Clone the repository
2. Follow the setup instructions in [DEVELOPMENT.md](./docs/DEVELOPMENT.md)
3. Use the provided start script to launch the application:

```bash
./start-sylo-ui.sh
```

## License

Copyright © 2025 Sylo Design Studio. All rights reserved.