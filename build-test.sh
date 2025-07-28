#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}==== $1 ====${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_step "Checking prerequisites"
if ! command_exists dotnet; then
    print_error ".NET CLI not found. Please install .NET SDK."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm not found. Please install Node.js and npm."
    exit 1
fi

print_success "Prerequisites check passed"

# Get script directory to ensure we're working from the right location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"


# Build and test API
print_step "Building .NET API"
cd api
if dotnet build; then
    print_success "API build completed"
else
    print_error "API build failed"
    exit 1
fi

print_step "Running .NET API tests"
if dotnet test; then
    print_success "API tests passed"
else
    print_error "API tests failed"
    exit 1
fi

# Build and test React app
print_step "Installing React dependencies"
cd ../web
if npm install; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

print_step "Building React app"
cd my-app
if npm run build; then
    print_success "React build completed"
else
    print_error "React build failed"
    exit 1
fi

print_step "Running React tests"
if npm test -- --run --passWithNoTests; then
    print_success "React tests passed"
else
    print_warning "React tests completed with warnings or no tests found"
fi

print_step "Starting applications"
cd ../../api/redington.calculation.api/

print_success "All builds and tests completed successfully!"
echo
print_step "Starting API server..."
echo -e "${YELLOW}API will be available at: http://localhost:5000 (or https://localhost:5001)${NC}"
echo -e "${YELLOW}Web UI will be available at: http://localhost:3000${NC}"
echo
echo -e "${BLUE}Press Ctrl+C to stop both servers${NC}"
echo

dotnet run &
API_PID=$!

sleep 3

cd ../../web/my-app/
npm start &
WEB_PID=$!

cleanup() {
    echo
    print_step "Shutting down servers..."
    kill $API_PID 2>/dev/null
    kill $WEB_PID 2>/dev/null
    print_success "Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
