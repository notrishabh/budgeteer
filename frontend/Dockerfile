# Step 1: Use node image for development
FROM node:18

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that Next.js uses
EXPOSE 3000

# Run the Next.js app in development mode
CMD ["npm", "run", "dev"]
