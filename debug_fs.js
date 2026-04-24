const fs = require('fs');
const path = require('path');

const report = [];

try {
    const pkgPath = path.resolve('package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        report.push(`package.json dependencies: ${JSON.stringify(pkg.dependencies, null, 2)}`);
    } else {
        report.push('package.json NOT FOUND');
    }

    const modPath = path.resolve('node_modules', 'remark-gfm');
    if (fs.existsSync(modPath)) {
        report.push(`node_modules/remark-gfm EXISTS`);
        const modPkgPath = path.join(modPath, 'package.json');
        if (fs.existsSync(modPkgPath)) {
             const modPkg = JSON.parse(fs.readFileSync(modPkgPath, 'utf8'));
             report.push(`remark-gfm version: ${modPkg.version}`);
        } else {
            report.push(`remark-gfm/package.json MISSING`);
        }
    } else {
        report.push(`node_modules/remark-gfm MISSING`);
        // List parent dir to see what's there
        const parentPath = path.resolve('node_modules');
        if (fs.existsSync(parentPath)) {
            const dirs = fs.readdirSync(parentPath).filter(d => d.startsWith('remark'));
            report.push(`node_modules entries starting with "remark": ${dirs.join(', ')}`);
        }
    }

} catch (e) {
    report.push(`ERROR: ${e.message}`);
}

fs.writeFileSync('fs_report.txt', report.join('\n'));
console.log('Report generated');
