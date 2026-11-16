import "server-only";
import {
  Document, Page, Text, View, StyleSheet, renderToBuffer,
} from "@react-pdf/renderer";
import React from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import { site } from "./site";
import { formatDate, formatEUR } from "./utils";

export type InvoiceData = {
  invoiceNumber: string;
  invoiceDate: Date;
  customer: {
    salutation?: string;
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    zip: string;
    city: string;
    email: string;
  };
  items: {
    description: string;
    courseRef: string;
    startDate: string;
    quantity: number;
    unitPriceCents: number;
  }[];
  vatRate: number;              // 0 für USt-frei nach §4 Nr.21 UStG
  vatNote?: string;
  paymentReference: string;     // Stripe Session ID
  paymentMethod: string;        // "Kreditkarte" / "PayPal" / "SEPA"
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#0f172a" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  logo: { fontSize: 18, fontWeight: "bold", color: "#1f4a85" },
  companyBlock: { fontSize: 8, color: "#64748b", textAlign: "right" },
  addresses: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  block: { width: "48%" },
  blockTitle: { fontSize: 8, color: "#64748b", marginBottom: 4 },
  blockText: { fontSize: 10, lineHeight: 1.5 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  meta: { fontSize: 9, color: "#64748b", marginBottom: 16 },
  table: { marginTop: 12, borderTop: 1, borderColor: "#cbd5e1" },
  tr: {
    flexDirection: "row",
    borderBottom: 1, borderColor: "#e2e8f0",
    paddingVertical: 8,
  },
  th: { fontSize: 9, fontWeight: "bold", color: "#475569" },
  cDesc: { width: "55%" },
  cQty: { width: "10%", textAlign: "right" },
  cPrice: { width: "17%", textAlign: "right" },
  cTotal: { width: "18%", textAlign: "right" },
  totals: { marginTop: 12, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", width: 260, justifyContent: "space-between", paddingVertical: 3 },
  totalLabel: { color: "#475569" },
  grandTotal: {
    flexDirection: "row", width: 260, justifyContent: "space-between",
    paddingVertical: 6, borderTop: 1, borderColor: "#0f172a", marginTop: 4,
    fontSize: 12, fontWeight: "bold",
  },
  footer: {
    position: "absolute", left: 40, right: 40, bottom: 30,
    fontSize: 8, color: "#64748b", borderTop: 1, borderColor: "#e2e8f0", paddingTop: 8,
    flexDirection: "row", justifyContent: "space-between",
  },
  note: { marginTop: 20, fontSize: 9, color: "#475569", lineHeight: 1.5 },
});

function InvoiceDocument({ data }: { data: InvoiceData }) {
  const net = data.items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0);
  const vat = Math.round(net * (data.vatRate / 100));
  const gross = net + vat;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>VFR · Verkehrsfachschule Rheinland GmbH</Text>
          <View style={styles.companyBlock}>
            <Text>{site.address.street}</Text>
            <Text>{site.address.zip} {site.address.city}</Text>
            <Text>{site.phone}</Text>
            <Text>{site.email}</Text>
          </View>
        </View>

        <View style={styles.addresses}>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>RECHNUNGSEMPFÄNGER</Text>
            <Text style={styles.blockText}>
              {data.customer.salutation ? `${data.customer.salutation} ` : ""}
              {data.customer.firstName} {data.customer.lastName}
            </Text>
            {data.customer.company && <Text style={styles.blockText}>{data.customer.company}</Text>}
            <Text style={styles.blockText}>{data.customer.street}</Text>
            <Text style={styles.blockText}>{data.customer.zip} {data.customer.city}</Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>RECHNUNGSDETAILS</Text>
            <Text style={styles.blockText}>Rechnungs-Nr.: {data.invoiceNumber}</Text>
            <Text style={styles.blockText}>Rechnungsdatum: {formatDate(data.invoiceDate)}</Text>
            <Text style={styles.blockText}>Zahlart: {data.paymentMethod}</Text>
            <Text style={styles.blockText}>Zahlungsreferenz: {data.paymentReference}</Text>
          </View>
        </View>

        <Text style={styles.title}>Rechnung {data.invoiceNumber}</Text>
        <Text style={styles.meta}>
          Vielen Dank für Ihre Buchung. Diese Rechnung wurde bereits bezahlt.
        </Text>

        <View style={styles.table}>
          <View style={[styles.tr, { borderTopWidth: 0 }]}>
            <Text style={[styles.th, styles.cDesc]}>Leistung</Text>
            <Text style={[styles.th, styles.cQty]}>Menge</Text>
            <Text style={[styles.th, styles.cPrice]}>Einzelpreis</Text>
            <Text style={[styles.th, styles.cTotal]}>Gesamt</Text>
          </View>
          {data.items.map((item, idx) => (
            <View key={idx} style={styles.tr}>
              <View style={styles.cDesc}>
                <Text style={{ fontWeight: "bold" }}>{item.description}</Text>
                <Text style={{ color: "#64748b", marginTop: 2 }}>
                  Kurs-ID: {item.courseRef} · Beginn {formatDate(item.startDate)}
                </Text>
              </View>
              <Text style={styles.cQty}>{item.quantity}</Text>
              <Text style={styles.cPrice}>{formatEUR(item.unitPriceCents)}</Text>
              <Text style={styles.cTotal}>{formatEUR(item.unitPriceCents * item.quantity)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Netto</Text>
            <Text>{formatEUR(net)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>USt ({data.vatRate}%)</Text>
            <Text>{formatEUR(vat)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text>Gesamtbetrag</Text>
            <Text>{formatEUR(gross)}</Text>
          </View>
        </View>

        {data.vatNote && <Text style={styles.note}>{data.vatNote}</Text>}

        <View style={styles.footer} fixed>
          <Text>
            VFR Verkehrsfachschule Rheinland GmbH · Karl-Hass-Str. 13 · 53859 Niederkassel
          </Text>
          <Text>Seite 1</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument data={data} />);
}

export async function archiveInvoice(data: InvoiceData, pdf: Buffer) {
  const dir = process.env.INVOICE_ARCHIVE_DIR ?? "./invoices";
  const archiveDir = path.resolve(process.cwd(), dir);
  await fs.mkdir(archiveDir, { recursive: true });

  const safeNumber = data.invoiceNumber.replace(/[^\w-]/g, "_");
  const filename = `${safeNumber}.pdf`;
  const filepath = path.join(archiveDir, filename);
  await fs.writeFile(filepath, pdf);

  // Sidecar JSON mit Metadaten für DATEV-Übernahme / Buchhaltung
  await fs.writeFile(
    filepath.replace(/\.pdf$/, ".json"),
    JSON.stringify(
      {
        invoiceNumber: data.invoiceNumber,
        invoiceDate: data.invoiceDate.toISOString(),
        customer: data.customer,
        items: data.items,
        net: data.items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0),
        vatRate: data.vatRate,
        paymentReference: data.paymentReference,
        paymentMethod: data.paymentMethod,
      },
      null,
      2,
    ),
    "utf8",
  );

  return { filename, filepath };
}
