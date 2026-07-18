FROM php:8.2-apache

# Enable required Apache modules
RUN a2enmod rewrite headers

# Install mysqli extension
RUN docker-php-ext-install mysqli

# Apache config: serve from /var/www/html with .htaccess support
RUN printf '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    <Directory /var/www/html>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>\n' > /etc/apache2/sites-available/000-default.conf

# PHP session config
RUN echo "session.cookie_samesite = None" >> /usr/local/etc/php/conf.d/session.ini \
 && echo "session.cookie_secure = 0" >> /usr/local/etc/php/conf.d/session.ini \
 && echo "session.cookie_httponly = 1" >> /usr/local/etc/php/conf.d/session.ini

# Copy backend files into DocumentRoot
# Build context must be ./backend (set in Render: Docker Build Context = ./backend)
WORKDIR /var/www/html
COPY index.php ./index.php
COPY .htaccess ./.htaccess
COPY api/ ./api/
COPY auth/ ./auth/
COPY config/ ./config/
COPY middleware/ ./middleware/
COPY setup.php ./setup.php
COPY debug.php ./debug.php

# Verify index.php is present (cache bust: v2)
RUN test -f /var/www/html/index.php || (echo "ERROR: index.php not found in /var/www/html" && exit 1)

EXPOSE 80
