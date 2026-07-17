FROM php:8.2-apache

# Enable required Apache modules
RUN a2enmod rewrite headers

# Install mysqli extension
RUN docker-php-ext-install mysqli

# Set working directory
WORKDIR /var/www/html/backend

# Copy backend source
COPY . .

# Apache config: allow .htaccess overrides and set DocumentRoot
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/backend\n\
    <Directory /var/www/html/backend>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# PHP session config
RUN echo "session.cookie_samesite = None" >> /usr/local/etc/php/conf.d/session.ini \
 && echo "session.cookie_secure = Off" >> /usr/local/etc/php/conf.d/session.ini

EXPOSE 80
