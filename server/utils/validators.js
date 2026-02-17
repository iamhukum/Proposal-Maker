function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateRegister(body) {
  const errors = [];
  if (!body.name || body.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!body.email || !validateEmail(body.email)) {
    errors.push('Valid email is required');
  }
  if (!body.password || body.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  return errors;
}

function validateProposal(body) {
  const errors = [];
  if (!body.client_name || body.client_name.trim().length === 0) {
    errors.push('Client name is required');
  }
  if (!body.project_title || body.project_title.trim().length === 0) {
    errors.push('Project title is required');
  }
  return errors;
}

module.exports = { validateEmail, validateRegister, validateProposal };
