
const dhcpSelect = document.getElementById('dhcpSelect');
const staticConfig = document.getElementById('staticConfig');
const interfaceNameSelect = document.getElementById('interfaceName');
const customInterfaceSection = document.getElementById('customInterfaceSection');
const customInterface = document.getElementById('customInterface');
const enableSearchDomain = document.getElementById('enableSearchDomain');
const searchDomainBlock = document.getElementById('searchDomainBlock');
const notification = document.getElementById('notification');

interfaceNameSelect.addEventListener('change', () => {
  customInterfaceSection.classList.toggle('show', interfaceNameSelect.value === 'custom');
  if (interfaceNameSelect.value === 'custom') customInterface.focus();
});

dhcpSelect.addEventListener('change', () => {
  staticConfig.classList.toggle('show', dhcpSelect.value === 'false');
});

enableSearchDomain.addEventListener('change', () => {
  searchDomainBlock.classList.toggle('show', enableSearchDomain.value === 'yes');
});

function validateIP(ip) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(ip);
}

function validateCIDR(cidr) {
  return /^\d{1,3}(\.\d{1,3}){3}\/\d{1,2}$/.test(cidr);
}

document.getElementById('ipAddress').addEventListener('input', (e) => {
  e.target.style.borderColor = validateCIDR(e.target.value) || e.target.value === '' ? 'var(--border)' : 'var(--error)';
});

document.getElementById('gateway').addEventListener('input', (e) => {
  e.target.style.borderColor = validateIP(e.target.value) || e.target.value === '' ? 'var(--border)' : 'var(--error)';
});

function generateNetplan() {
  const btnText = document.getElementById('btnText');
  const btnLoading = document.getElementById('btnLoading');
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline-block';

  setTimeout(() => {
    const iface = interfaceNameSelect.value === 'custom' ? customInterface.value.trim() || 'eth0' : interfaceNameSelect.value;
    const dhcp = dhcpSelect.value === 'true';
    const renderer = document.getElementById('renderer').value;
    let config = `network:\n  version: 2\n  renderer: ${renderer}\n  ethernets:\n    ${iface}:\n      dhcp4: ${dhcp}`;

    if (!dhcp) {
      const ip = document.getElementById('ipAddress').value.trim();
      const gateway = document.getElementById('gateway').value.trim();
      const dnsInput = document.getElementById('dns').value.trim();
      const enableSearch = enableSearchDomain.value === 'yes';
      const searchDomain = document.getElementById('searchDomain').value.trim();

      if (ip) {
        config += `\n      addresses:\n        - ${ip}`;
      }

      if (gateway) {
        config += `\n      routes:\n        - to: default\n          via: ${gateway}`;
      }

      if (dnsInput) {
        const dnsServers = dnsInput.split(',').map(d => d.trim()).filter(Boolean);
        if (dnsServers.length) {
          config += `\n      nameservers:\n        addresses:`;
          dnsServers.forEach(d => config += `\n          - ${d}`);

          if (enableSearch && searchDomain) {
            config += `\n        search:\n          - ${searchDomain}`;
          }
        }
      }
    }

    const output = document.getElementById('output');
    output.value = config;
    output.style.transform = 'scale(0.95)';
    output.style.opacity = '0.5';

    setTimeout(() => {
      output.style.transform = 'scale(1)';
      output.style.opacity = '1';
    }, 100);

    btnLoading.style.display = 'none';
    btnText.style.display = 'inline';
    btnText.textContent = '✅ Configuration générée !';

    setTimeout(() => {
      btnText.textContent = '✨ Générer la configuration';
    }, 2000);
  }, 800);
}

function copyOutput() {
  const output = document.getElementById('output');
  if (!output.value.trim()) return showNotification('⚠️ Aucune configuration à copier !', 'warning');

  navigator.clipboard?.writeText(output.value)
    .then(() => showNotification('✅ Configuration copiée !'))
    .catch(() => fallbackCopy(output));
}

function fallbackCopy(element) {
  element.select();
  element.setSelectionRange(0, 99999);
  try {
    document.execCommand('copy');
    showNotification('✅ Configuration copiée !');
  } catch {
    showNotification('❌ Erreur lors de la copie', 'error');
  }
}

function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') generateNetplan();
  if (e.ctrlKey && e.key === 'c' && e.target.id === 'output') copyOutput();
});

window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => document.body.style.opacity = '1', 100);
});
