package com.inventory.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private static Connection koneksi;

    // Bisa di-override lewat environment variable, default tetap localhost:3306 root tanpa password
    private static String env(String key, String def) {
        String v = System.getenv(key);
        return (v == null || v.isEmpty()) ? def : v;
    }

    public static Connection getConnection() {
        try {

            Class.forName("com.mysql.cj.jdbc.Driver");

            String url = "jdbc:mysql://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "3306")
                    + "/" + env("DB_NAME", "inventory_db");

            koneksi = DriverManager.getConnection(url, env("DB_USER", "root"), env("DB_PASSWORD", ""));
            System.out.println("Berhasil Koneksi Ke Database inventory_db");

        } catch (ClassNotFoundException ex) {
            System.out.println("Driver Tidak Ditemukan: " + ex.getMessage());
        } catch (SQLException ex) {
            System.out.println("Gagal Koneksi Ke Database: " + ex.getMessage());
        }
        return koneksi;
    }

    public static void main(String[] args) {

        getConnection();
    }
}
