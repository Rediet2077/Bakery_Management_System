FROM php:8.2-apache

# Enable required Apache modules
RUN a2enmod rewrite headers

# Install mysqli extension
RUN docker-php-ext-install mysqli

# Copy backend source directly into DocumentRoot
WORKDIR /var/www/html
COPY . .

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
 && echo "session.cookie_secure = Off" >> /usr/local/etc/php/conf.d/session.ini

EXPOSE 80
