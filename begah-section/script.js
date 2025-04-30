let currentStep = 1;

function nextStep(step) {
  if (step === 1) {
    const teamNameInput = document.getElementById('teamName');
    if (!teamNameInput.value.trim()) {
      teamNameInput.setCustomValidity('Masukkan nama tim terlebih dahulu.');
      teamNameInput.reportValidity();
      return;
    } else {
      teamNameInput.setCustomValidity('');
    }
  }

  if (step === 2) {
    const inputs = document.querySelectorAll('#step2 input');
    let valid = true;
    for (let i = 0; i < 10; i++) {
      if (!inputs[i].value.trim()) {
        inputs[i].setCustomValidity('Lengkapi data ini terlebih dahulu.');
        inputs[i].reportValidity();
        valid = false;
        break;
      } else {
        inputs[i].setCustomValidity('');
      }
    }
    if (!valid) return;
  }

  document.getElementById(`step${step}`).classList.remove('active');
  document.getElementById(`step${step + 1}`).classList.add('active');
  currentStep++;

  toggleBackButton();
}

function prevStep(step) {
  document.getElementById(`step${step}`).classList.remove('active');
  document.getElementById(`step${step - 1}`).classList.add('active');
  currentStep--;
  toggleBackButton();
}

function toggleBackButton() {
  const allSteps = document.querySelectorAll('.form-step');
  allSteps.forEach((stepDiv) => {
    const backBtn = stepDiv.querySelector('.back-btn');
    if (backBtn) {
      backBtn.style.display = (currentStep > 1 && currentStep <= 3) ? 'inline-block' : 'none';
    }
  });
}

// Menghapus peringatan jika user mulai mengetik
function removeWarningOnInput() {
  const allInputs = document.querySelectorAll('input');
  allInputs.forEach(input => {
    input.addEventListener('input', () => {
      input.setCustomValidity(''); // Menghapus peringatan
    });
  });
}

// Panggil fungsi ini untuk mengaktifkan event listener pada setiap input
removeWarningOnInput();

document.getElementById('registrationForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const logoInput = document.getElementById('logo');
  const logo = logoInput.files[0];
  if (!logo) {
    logoInput.setCustomValidity('Silakan pilih logo tim terlebih dahulu.');
    logoInput.reportValidity();
    return;
  } else {
    logoInput.setCustomValidity('');
  }

  const teamName = document.getElementById('teamName').value.trim();
  const inputs = document.querySelectorAll('#step2 input');
  const members = [];
  for (let i = 0; i < inputs.length; i += 2) {
    members.push({
      ign: inputs[i].value.trim(),
      discord: inputs[i + 1].value.trim()
    });
  }

  const webhookURL = "https://discord.com/api/webhooks/1366963453700477050/UHKTgTUWyP57j5SbRJZXLnk01C_2pCXSM2yCgX18Pxtn54_uop9HDrXdnjpes-4T7NYL";

  let content = `📥 **Pendaftaran Tim Free Fire - Begah Section**\n\n`;
  content += `**Nama Tim**\n🔹 **${teamName}**\n\n`;

  const roles = [
    { label: "👑 **Kapten**", index: 0 },
    { label: "👤 **Player 1**", index: 1 },
    { label: "👤 **Player 2**", index: 2 },
    { label: "👤 **Player 3**", index: 3 },
    { label: "👤 **Player 4**", index: 4 },
    { label: "👤 **Cadangan (Opsional)**", index: 5 },
  ];

  roles.forEach((role, i) => {
    const ign = members[i]?.ign || "-";
    const discord = members[i]?.discord || "-";
    content += `${role.label}\n\`\`\`\n🔸 In Game  : ${ign}\n🔸 Discord  : ${discord}\n\`\`\`\n`;
  });

  const formData = new FormData();
  formData.append("payload_json", JSON.stringify({ content }));
  formData.append("file", logo);

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.innerText = "Mengirim...";

  try {
    await fetch(webhookURL, { method: "POST", body: formData });

    document.querySelector(".form-container").innerHTML = `
      <h2 style="text-align:center; color:limegreen;">✅ Terima kasih!</h2>
      <p style="text-align:center;">Pendaftaran Anda telah berhasil dikirim ke panitia.</p>
    `;
  } catch (error) {
    alert("Gagal mengirim pendaftaran.");
    console.error(error);
    submitBtn.disabled = false;
    submitBtn.innerText = "Daftarkan";
  }
});
