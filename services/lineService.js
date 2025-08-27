const lineRepository = require('../repositories/lineRepository');
const payloadChecker = require('payload-validator');

class LineService {
  async getAllLines() {
    return await lineRepository.findAll();
  }

  async createLine(lineData) {
    const expectedPayload = {
      Id: { type: 'string', required: true },
      Name: { type: 'string', required: true },
      Description: { type: 'string', required: false },
      Device: { type: 'array', required: false },
      Profil: { type: 'string', required: false }, // ObjectId as string
    };
    const validation = payloadChecker.validator(lineData, expectedPayload, Object.keys(expectedPayload), false);
    if (validation.hasError) {
      throw new Error(`Validation error: ${JSON.stringify(validation.response.errorMessage)}`);
    }

    return await lineRepository.create(lineData);
  }

  async getLineById(id) {
    const line = await lineRepository.findById(id);
    if (!line) throw new Error('Line not found');
    return line;
  }

  async updateLine(id, updates) {
    const allowedFields = ['Name', 'Description', 'Device', 'Profil'];
    const filteredUpdates = {};
    for (const key in updates) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    }
    if (Object.keys(filteredUpdates).length === 0) throw new Error('No valid fields to update');

    const line = await lineRepository.updateById(id, filteredUpdates);
    if (!line) throw new Error('Line not found');
    return line;
  }

  async deleteLine(id) {
    const line = await lineRepository.deleteById(id);
    if (!line) throw new Error('Line not found');
    return { message: 'Line deleted successfully' };
  }
}

module.exports = new LineService();