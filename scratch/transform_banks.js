const fs = require('fs');
const path = require('path');

const inputPath = '/Users/ivanlai/.gemini/antigravity/brain/87c1e3f0-cd5b-4bc3-9a36-cdfe31c941f9/.system_generated/steps/416/content.md';
const outputPath = path.join(process.cwd(), 'src/config/taiwan-banks.ts');

function transform() {
  try {
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const jsonMatch = rawData.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in input file');
      return;
    }
    
    const data = JSON.parse(jsonMatch[0]);
    const banks = Object.entries(data).map(([code, bank]) => {
      return {
        code,
        name: bank.name,
        branches: bank.branchs.map((b) => ({
          code: b.branch,
          name: b.name
        }))
      };
    });

    const tsContent = `// Taiwan Bank Data
// Source: nczz/taiwan-banks-list
// Only includes Bank Name, Code, and Branch Name/Code.

export interface BankBranch {
  code: string;
  name: string;
}

export interface Bank {
  code: string;
  name: string;
  branches: BankBranch[];
}

export const TAIWAN_BANKS: Bank[] = ${JSON.stringify(banks, null, 2)};
`;

    fs.writeFileSync(outputPath, tsContent);
    console.log(`Successfully generated ${outputPath}`);
  } catch (error) {
    console.error('Error transforming bank data:', error);
  }
}

transform();
