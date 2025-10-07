-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NULL DEFAULT 'user',
    `department` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `email`(`email`),
    INDEX `idx_users_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
