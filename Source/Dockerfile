FROM nginx:alpine

LABEL version="1.0"
LABEL description="TMS Calculator web-app hosted by Nginx web-server"
LABEL org.opencontainers.image.authors="Alexey Parfimovich"

ENV TZ=Europe/Minsk

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy TMS site config and webapp files
COPY ./* ./

EXPOSE 80/tcp

# Define entrypoint
ENTRYPOINT ["nginx"]
# Define default entrypoint parameters (can be changed from CLI)
CMD ["-g", "daemon off;"]
