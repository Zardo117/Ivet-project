// services/aiService.js
// Serviço mock de IA para diagnóstico de pets

/**
 * Serviço mock de IA para geração de diagnósticos
 * Em produção, este serviço seria substituído por uma chamada real ao serviço de IA
 */
class AIService {
  /**
   * Gera um diagnóstico baseado nos sintomas e informações do pet
   * @param {string} symptoms - Sintomas apresentados pelo pet
   * @param {string} species - Espécie do animal
   * @param {string} breed - Raça do animal
   * @returns {Promise<Object>} Diagnóstico gerado
   */
  static async diagnose(symptoms, species = null, breed = null) {
    // Simula um delay de processamento
    await new Promise(resolve => setTimeout(resolve, 500));

    // Lógica mock de diagnóstico baseada em palavras-chave nos sintomas
    const symptomsLower = symptoms.toLowerCase();
    const possibleDiagnosis = [];
    const recommendations = [];

    // Diagnósticos baseados em sintomas comuns
    if (symptomsLower.includes('vômito') || symptomsLower.includes('vomito')) {
      possibleDiagnosis.push('Gastrite');
      possibleDiagnosis.push('Intoxicação alimentar');
      recommendations.push('Manter o pet em jejum por 12 horas');
      recommendations.push('Oferecer água em pequenas quantidades');
    }

    if (symptomsLower.includes('diarréia') || symptomsLower.includes('diarreia')) {
      possibleDiagnosis.push('Gastroenterite');
      possibleDiagnosis.push('Parasitose intestinal');
      recommendations.push('Hidratação adequada');
      recommendations.push('Exame de fezes recomendado');
    }

    if (symptomsLower.includes('febre') || symptomsLower.includes('temperatura')) {
      possibleDiagnosis.push('Infecção');
      possibleDiagnosis.push('Processo inflamatório');
      recommendations.push('Monitorar temperatura');
      recommendations.push('Medicação antitérmica se necessário');
    }

    if (symptomsLower.includes('tosse') || symptomsLower.includes('espirro')) {
      possibleDiagnosis.push('Infecção respiratória');
      possibleDiagnosis.push('Alergia');
      recommendations.push('Isolamento se necessário');
      recommendations.push('Avaliação respiratória completa');
    }

    if (symptomsLower.includes('coceira') || symptomsLower.includes('coçar')) {
      possibleDiagnosis.push('Dermatite');
      possibleDiagnosis.push('Alergia');
      recommendations.push('Evitar lambedura excessiva');
      recommendations.push('Avaliação dermatológica');
    }

    if (symptomsLower.includes('letargia') || symptomsLower.includes('apático') || symptomsLower.includes('fraco')) {
      possibleDiagnosis.push('Desidratação');
      possibleDiagnosis.push('Infecção sistêmica');
      recommendations.push('Avaliação clínica completa');
      recommendations.push('Exames laboratoriais recomendados');
    }

    if (symptomsLower.includes('falta de apetite') || symptomsLower.includes('não come')) {
      possibleDiagnosis.push('Anorexia');
      recommendations.push('Investigar causa subjacente');
      recommendations.push('Suporte nutricional se necessário');
    }

    // Se não houver diagnóstico específico, adiciona diagnósticos genéricos
    if (possibleDiagnosis.length === 0) {
      possibleDiagnosis.push('Sintomas inespecíficos');
      possibleDiagnosis.push('Avaliação clínica necessária');
      recommendations.push('Observação dos sintomas');
      recommendations.push('Retorno se sintomas persistirem');
    }

    // Adiciona recomendações gerais
    recommendations.push('Manter o pet em ambiente tranquilo');
    recommendations.push('Observar evolução dos sintomas');
    recommendations.push('Retornar ao veterinário se necessário');

    return {
      possibleDiagnosis: [...new Set(possibleDiagnosis)], // Remove duplicatas
      recommendations: recommendations.join('. ') + '.',
      confidence: possibleDiagnosis.length > 0 ? 0.7 : 0.5,
      note: 'Este é um diagnóstico preliminar gerado por IA. Consulte sempre um veterinário para diagnóstico definitivo.'
    };
  }
}

module.exports = AIService;

