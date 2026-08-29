import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

const pdfPath = path.join(downloadsDir, 'biology_summary_m46.pdf');
const doc = new PDFDocument({ margin: 40, size: 'A4' });

const stream = fs.createWriteStream(pdfPath);
doc.pipe(stream);

// Header / Title
doc.fillColor('#065f46')
   .fontSize(22)
   .text('StudyRoad Academic Excellence Series', { align: 'center' });

doc.moveDown(0.5);
doc.fillColor('#047857')
   .fontSize(16)
   .text('Summary Note: A-Level Biology (High School Grades 10-12)', { align: 'center' });

doc.moveDown(0.2);
doc.fillColor('#374151')
   .fontSize(10)
   .text('Edition: 2026 High-Yield Edition | Publisher: StudyRoad EdTech', { align: 'center' });

doc.moveDown(1);
doc.strokeColor('#059669').lineWidth(2).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
doc.moveDown(1);

// Chapter 1
doc.fillColor('#065f46').fontSize(14).text('Chapter 1: Cell Biology & Transport Mechanisms');
doc.fillColor('#1f2937').fontSize(10).text(`
• Cell Organelles:
  - Nucleus: Controls genetic material (DNA/RNA) and transcription.
  - Mitochondria: Double membrane, ATP production via Krebs cycle & ETC.
  - Chloroplast: Thylakoid (Light reaction) & Stroma (Calvin cycle).
  - Endoplasmic Reticulum: RER (Protein synthesis) vs SER (Lipid synthesis & detoxification).
• Membrane Transport:
  - Passive Transport: Simple Diffusion, Facilitated Diffusion (Carrier/Channel proteins), Osmosis.
  - Active Transport: Requires ATP against concentration gradient (e.g., Na+/K+ pump).
  - Bulk Transport: Endocytosis (Phagocytosis/Pinocytosis) and Exocytosis.
• Cell Division:
  - Mitosis: 2n -> 2n (Somatic growth, genetically identical).
  - Meiosis: 2n -> 1n (Gamete production, Genetic variation via Crossing Over in Prophase I).
`, { lineGap: 3 });

doc.moveDown(1);

// Chapter 2
doc.fillColor('#065f46').fontSize(14).text('Chapter 2: Bioenergetics & Respiration');
doc.fillColor('#1f2937').fontSize(10).text(`
• Cellular Respiration (Yield: 30-32 ATP per Glucose):
  1. Glycolysis (Cytosol): Glucose -> 2 Pyruvate + 2 ATP + 2 NADH.
  2. Acetyl-CoA Formation (Mitochondrial Matrix): 2 Pyruvate -> 2 Acetyl-CoA + 2 NADH + 2 CO2.
  3. Krebs Cycle (Matrix): Produces 2 ATP, 6 NADH, 2 FADH2, 4 CO2.
  4. Electron Transport Chain (Inner Membrane/Cristae): Oxidative phosphorylation yielding most ATP.
• Photosynthesis:
  - Light Dependent Reaction: Occurs in Thylakoid membrane, uses H2O & Light, yields ATP, NADPH, and O2 byproduct.
  - Calvin Cycle (Light Independent): Occurs in Stroma, fixes CO2 using RuBisCO enzyme to produce G3P / Glucose.
`, { lineGap: 3 });

doc.moveDown(1);

// Chapter 3
doc.fillColor('#065f46').fontSize(14).text('Chapter 3: Genetics & Biotechnology');
doc.fillColor('#1f2937').fontSize(10).text(`
• Mendel's Laws:
  - Law of Segregation: Alleles separate during gamete formation.
  - Law of Independent Assortment: Genes on different chromosomes assort independently (9:3:3:1 Dihybrid ratio).
• Molecular Biology Central Dogma:
  - DNA Replication: Semi-conservative, DNA Polymerase (5' -> 3' direction).
  - Transcription: RNA Polymerase synthesizes mRNA from DNA template.
  - Translation: Ribosome reads mRNA codons, tRNA brings corresponding amino acids.
• DNA Technology (High Exam Frequency):
  - PCR (Polymerase Chain Reaction): Denaturation (95°C) -> Annealing (55°C) -> Extension (72°C).
  - Restriction Enzymes: Cut DNA at specific palindromic sequences.
`, { lineGap: 3 });

doc.moveDown(1);

// Chapter 4
doc.fillColor('#065f46').fontSize(14).text('Chapter 4: Human Physiology Key Highlights');
doc.fillColor('#1f2937').fontSize(10).text(`
• Digestive System: Salivary Amylase -> Pepsin (Stomach, Acidic pH 1.5-2.0) -> Trypsin & Lipase (Pancreas/Small Intestine).
• Nervous System: Action Potential (Depolarization via Na+ influx, Repolarization via K+ efflux).
• Immune System: Innate Immunity vs Adaptive Immunity (B-cells produce Antibodies; T-cells direct cellular attack).
`, { lineGap: 3 });

doc.moveDown(1);

// Footer
doc.fillColor('#6b7280').fontSize(9).text('© 2026 StudyRoad Platform. All Rights Reserved. Official Premium Study Material.', { align: 'center' });

doc.end();

stream.on('finish', () => {
  console.log('✅ Generated PDF file successfully at:', pdfPath);
});
