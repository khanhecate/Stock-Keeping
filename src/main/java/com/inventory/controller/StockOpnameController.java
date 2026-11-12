package com.inventory.controller;

import com.inventory.dao.AssetDAO;
import com.inventory.model.Asset;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import java.util.Optional;
import javafx.stage.FileChooser;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDate;

public class StockOpnameController {

    @FXML
    private TextField txtSearch;
    @FXML
    private TableView<Asset> tableStock;
    @FXML
    private TableColumn<Asset, String> colBarcode, colName, colCategory, colStatus, colUnit;
    @FXML
    private TableColumn<Asset, Integer> colQtySystem;

    @FXML
    private Label lblSelectedItem, lblQtySystem;
    @FXML
    private TextField txtQtyPhysical;
    @FXML
    private Button btnAdjust;

    private AssetDAO assetDao = new AssetDAO();
    private Asset selectedAsset = null;

    @FXML
    public void initialize() {
        if (tableStock != null) {
            tableStock.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        }

        colBarcode.setCellValueFactory(new PropertyValueFactory<>("barcodeCode"));
        colName.setCellValueFactory(new PropertyValueFactory<>("name"));
        colCategory.setCellValueFactory(new PropertyValueFactory<>("categoryName"));
        colStatus.setCellValueFactory(new PropertyValueFactory<>("status"));
        colQtySystem.setCellValueFactory(new PropertyValueFactory<>("quantity"));
        colUnit.setCellValueFactory(new PropertyValueFactory<>("unit"));

        tableStock.getSelectionModel().selectedItemProperty().addListener((obs, oldVal, newVal) -> {
            if (newVal != null) {
                selectedAsset = newVal;
                String prefix = newVal.getBarcodeCode() != null && !newVal.getBarcodeCode().isEmpty()
                        ? "[" + newVal.getBarcodeCode() + "] "
                        : "";
                lblSelectedItem.setText(prefix + newVal.getName());
                lblQtySystem.setText(String.valueOf(newVal.getQuantity()) + " "
                        + (newVal.getUnit() != null ? newVal.getUnit() : ""));

                if ("ASET".equalsIgnoreCase(newVal.getCategoryType())) {
                    txtQtyPhysical.setDisable(true);
                    txtQtyPhysical.setText("1");
                    txtQtyPhysical.setPromptText("ASET selalu 1");
                    btnAdjust.setDisable(true);
                } else {
                    txtQtyPhysical.setDisable(false);
                    txtQtyPhysical.clear();
                    txtQtyPhysical.setPromptText("Masukkan jumlah fisik");
                    btnAdjust.setDisable(false);
                }
            } else {
                clearSelection();
            }
        });

        if (txtSearch != null) {
            txtSearch.textProperty().addListener((obs, oldVal, newVal) -> {
                tableStock.getItems().setAll(assetDao.search(newVal));
            });
        }

        loadData();
    }

    private void loadData() {
        tableStock.getItems().setAll(assetDao.getAll());
        clearSelection();
    }

    @FXML
    private void handleRefresh() {
        if (txtSearch != null)
            txtSearch.clear();
        loadData();
    }

    private void clearSelection() {
        selectedAsset = null;
        lblSelectedItem.setText("Belum ada yang dipilih");
        lblQtySystem.setText("0");
        txtQtyPhysical.clear();
        txtQtyPhysical.setDisable(true);
        btnAdjust.setDisable(true);
    }

    @FXML
    private void handleAdjust() {
        if (selectedAsset == null)
            return;

        if ("ASET".equalsIgnoreCase(selectedAsset.getCategoryType())) {
            Alert alert = new Alert(Alert.AlertType.INFORMATION,
                    "Data bertipe ASET tidak dapat diubah jumlahnya secara manual melalui Stock Opname.");
            alert.showAndWait();
            return;
        }

        int newQty = 0;
        try {
            newQty = Integer.parseInt(txtQtyPhysical.getText());
            if (newQty < 0)
                throw new Exception();
        } catch (Exception e) {
            Alert alert = new Alert(Alert.AlertType.WARNING, "Qty Fisik harus berupa angka 0 atau lebih besar!");
            alert.showAndWait();
            txtQtyPhysical.requestFocus();
            return;
        }

        if (newQty == selectedAsset.getQuantity()) {
            Alert alert = new Alert(Alert.AlertType.INFORMATION,
                    "Qty Fisik sama dengan Qty Sistem. Tidak ada penyesuaian yang perlu dilakukan.");
            alert.showAndWait();
            return;
        }

        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION, "Anda yakin ingin mengubah stok sistem dari "
                + selectedAsset.getQuantity() + " menjadi " + newQty + "?", ButtonType.YES, ButtonType.NO);
        confirm.showAndWait();

        if (confirm.getResult() == ButtonType.YES) {
            if (assetDao.updateQuantity(selectedAsset.getId(), newQty)) {
                Alert success = new Alert(Alert.AlertType.INFORMATION, "Penyesuaian stok berhasil disimpan!");
                success.showAndWait();

                // Jika stok habis, sekalian update status
                if (newQty == 0) {
                    assetDao.updateStatus(selectedAsset.getId(), "Habis");
                } else if (newQty > 0 && "Habis".equalsIgnoreCase(selectedAsset.getStatus())) {
                    assetDao.updateStatus(selectedAsset.getId(), "Tersedia");
                }

                loadData();
            } else {
                Alert error = new Alert(Alert.AlertType.ERROR, "Gagal menyimpan penyesuaian stok ke database!");
                error.showAndWait();
            }
        }
    }

    @FXML
    private void handlePrintReport() {
        if (tableStock.getItems().isEmpty()) {
            Alert alert = new Alert(Alert.AlertType.WARNING, "Tidak ada data untuk dicetak!");
            alert.showAndWait();
            return;
        }

        try {
            java.io.InputStream reportStream = getClass().getResourceAsStream("/reports/ReportStockOpname.jrxml");
            if (reportStream == null) {
                throw new Exception("File template laporan tidak ditemukan di /reports/ReportStockOpname.jrxml!");
            }
            net.sf.jasperreports.engine.JasperReport jasperReport = net.sf.jasperreports.engine.JasperCompileManager
                    .compileReport(reportStream);
            net.sf.jasperreports.engine.data.JRBeanCollectionDataSource dataSource = new net.sf.jasperreports.engine.data.JRBeanCollectionDataSource(
                    tableStock.getItems());
            java.util.Map<String, Object> parameters = new java.util.HashMap<>();

            net.sf.jasperreports.engine.JasperPrint jasperPrint = net.sf.jasperreports.engine.JasperFillManager
                    .fillReport(jasperReport, parameters, dataSource);
            net.sf.jasperreports.view.JasperViewer.viewReport(jasperPrint, false);

        } catch (Exception e) {
            e.printStackTrace();
            Alert alert = new Alert(Alert.AlertType.ERROR, "Gagal mencetak laporan: " + e.getMessage());
            alert.showAndWait();
        }
    }

    @FXML
    private void handleExportExcel() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Simpan Laporan Stock Opname");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("Excel Files", "*.xlsx"));
        fileChooser.setInitialFileName("Laporan_Stock_Opname_" + LocalDate.now() + ".xlsx");

        File file = fileChooser.showSaveDialog(tableStock.getScene().getWindow());

        if (file != null) {
            try (Workbook workbook = new XSSFWorkbook()) {
                Sheet sheet = workbook.createSheet("Stock Opname");

                Row header = sheet.createRow(0);
                header.createCell(0).setCellValue("Barcode");
                header.createCell(1).setCellValue("Nama Barang");
                header.createCell(2).setCellValue("Kategori");
                header.createCell(3).setCellValue("Status");
                header.createCell(4).setCellValue("Qty Sistem");
                header.createCell(5).setCellValue("Satuan");

                int rowIdx = 1;
                for (Asset o : tableStock.getItems()) {
                    Row row = sheet.createRow(rowIdx++);
                    row.createCell(0).setCellValue(o.getBarcodeCode());
                    row.createCell(1).setCellValue(o.getName());
                    row.createCell(2).setCellValue(o.getCategoryName());
                    row.createCell(3).setCellValue(o.getStatus());
                    row.createCell(4).setCellValue(o.getQuantity());
                    row.createCell(5).setCellValue(o.getUnit());
                }

                for (int i = 0; i < 6; i++) {
                    sheet.autoSizeColumn(i);
                }

                try (FileOutputStream fileOut = new FileOutputStream(file)) {
                    workbook.write(fileOut);
                }

                Alert alert = new Alert(Alert.AlertType.INFORMATION, "Data berhasil diexport ke Excel!");
                alert.showAndWait();

            } catch (Exception e) {
                Alert alert = new Alert(Alert.AlertType.ERROR, "Gagal mengexport file: " + e.getMessage());
                alert.showAndWait();
            }
        }
    }
}
