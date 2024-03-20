#===========================================#
## BASE IMAGE
#===========================================#

# Base image
FROM node:20-alpine as base

# Set NPM logs less verbose
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# App should be run as node user, so set to directory
USER node
WORKDIR /home/node/app

# Copy the source code over
COPY --chown=node:node . /home/node/app/

#===========================================#
## DEVELOPMENT
#===========================================#

# Define development stage
FROM base as development
WORKDIR /home/node/app

# Install dependencies
RUN npm install

# Set user
USER node

# Set PORT
EXPOSE 3000

# Start App
CMD ["npm", "start"]

#===========================================#
## Production
#===========================================#

# Define development stage
FROM base as production
WORKDIR /home/node/app
COPY --chown=node:node --from=development /home/node/app/node_modules /home/node/app/node_module

# Build the Docusaurus app
RUN npm run build


#===========================================#
## DEPLOY
#===========================================#

FROM nginx:stable-alpine as deploy
WORKDIR /home/node/app

# Copy the build from production
COPY --chown=node:node --from=production /home/node/app/build /usr/share/nginx/html/