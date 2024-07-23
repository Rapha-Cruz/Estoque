CREATE TABLE categorias (
  id_categoria SERIAL PRIMARY KEY,
  nome_categoria VARCHAR(100) NOT NULL
);

CREATE TABLE produtos (
    id_produto SERIAL PRIMARY KEY,
    nome_produto VARCHAR(100) NOT NULL,
    estoque DOUBLE PRECISION NOT NULL,
    valor DOUBLE PRECISION NOT NULL,
    imagem TEXT,
    id_categoria INT,
    
    CONSTRAINT fk_categoria
        FOREIGN KEY(id_categoria) 
        REFERENCES categorias(id_categoria)
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome_usuario VARCHAR(50) NOT NULL,
    usuario VARCHAR(30) NOT NULL,
    senha VARCHAR(30) NOT NULL
);

CREATE TABLE movimentacoes (
    id_movimentacao SERIAL PRIMARY KEY,
    tipo_movimentacao CHAR(1) NOT NULL,
    data_movimentacao DATE NOT NULL,
    quantidade DOUBLE PRECISION NOT NULL,
    id_produto INT,
    id_usuario INT,
    
    CONSTRAINT fk_produto
        FOREIGN KEY(id_produto) 
        REFERENCES produtos(id_produto),
    CONSTRAINT fk_usuario
        FOREIGN KEY(id_usuario) 
        REFERENCES usuarios(id_usuario)
);
