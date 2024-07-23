const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const criar_conexao = require('./conexao');

//inicializa a aplicação Express
const app = express();

// Configuração do banco de dados
const pool = new Pool(criar_conexao.db);

// Configura o EJS como o motor de template
app.set('view engine', 'ejs');
app.set('views', './views'); // Diretório para armazenar os arquivos EJS

// Serve arquivos estáticos da pasta 'public'
app.use(express.static('public'));

//configura o middleware para processar requisições HTTP com payloads JSON
app.use(bodyParser.json());

// Categorias
// Create - Criar uma nova categoria
app.post('/categorias', async (req, res) => {
    //declaraçaõ de variavel pegando do arquivo json
    const { nome_categoria } = req.body;
    // const nome_categoria = req.body.nome_categoria
    //////

    try {
        const result = await pool.query(
            'INSERT INTO categorias (nome_categoria) VALUES ($1) RETURNING *',
            [nome_categoria]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read - Obter todas as categorias
app.get('/categorias', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categorias');
        // Renderiza a página EJS com a lista de categorias
        res.render('categorias', { categorias: result.rows });
        //res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read - Obter uma categoria por ID
app.get('/categorias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM categorias WHERE id_categoria = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update - Atualizar uma categoria por ID
app.put('/categorias/:id', async (req, res) => {
    const { id } = req.params;
    const { nome_categoria } = req.body;
    try {
        const result = await pool.query(
            'UPDATE categorias SET nome_categoria = $1 WHERE id_categoria = $2 RETURNING *',
            [nome_categoria, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete - Deletar uma categoria por ID
app.delete('/categorias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM categorias WHERE id_categoria = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        res.status(200).json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//porta do servidor do node
const port = 3000;
app.listen(port, () => {
    console.log(`API rodando em: http://localhost:${port}`);
});
