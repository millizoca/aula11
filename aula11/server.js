require('dotenv').config();
const express = require('express');
const supabase = require('./src/config/supabaseClient'); // Corrigido 'scr' para 'src' se necessário

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Buscar todos os pacientes ordenados pelo nome (ou data de cadastro)
app.get('/pacientes', async (req, res) => {
  const { data, error } = await supabase
    .from('pacientes_pet')
    .select('*')
    .order('nome', { ascending: true });

  if (error) {
    return res.status(500).json({ erro: 'Erro ao consultar a lista de pacientes' });
  }

  res.json(data);
});

// Buscar paciente específico por ID
app.get('/pacientes/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pacientes_pet')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error?.code === 'PGRST116' || !data) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    if (error) {
      return res.status(500).json({ erro: 'Erro ao consultar o cadastro do paciente' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ erro: 'Falha interna no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis: http://localhost:${PORT}/pacientes`);
});