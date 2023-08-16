/**
 * @author jcfbernardo
 */
class CaixaDaLanchonete {
    constructor() {
        this.cardapio = {
            cafe: { descricao: 'Café', valor: 3.00 },
            chantily: { descricao: 'Chantily (extra do Café)', valor: 1.50 },
            suco: { descricao: 'Suco Natural', valor: 6.20 },
            sanduiche: { descricao: 'Sanduíche', valor: 6.50 },
            queijo: { descricao: 'Queijo (extra do Sanduíche)', valor: 2.00 },
            salgado: { descricao: 'Salgado', valor: 7.25 },
            combo1: { descricao: '1 Suco e 1 Sanduíche', valor: 9.50 },
            combo2: { descricao: '1 Café e 1 Sanduíche', valor: 7.50 }
        };
    }

    // Validação da forma de pagamento
    validarMetodoDePagamento = metodoDePagamento =>
        !['dinheiro', 'credito', 'debito'].includes(metodoDePagamento)
            ? 'Forma de pagamento inválida!'
            : null;

    // Validação dos itens no carrinho
    validarItens = itens =>
        itens.length === 0 ? 'Não há itens no carrinho de compra!' : null;

    // Validação de código inválido no cardápio
    validarCodigoCardapio = codigo =>
        !this.cardapio.hasOwnProperty(codigo) ? 'Item inválido!' : null;

    // Validação de quantidade inválida
    validarQuantidade = quantidade =>
        quantidade <= 0 ? 'Quantidade inválida!' : null;

    // Validação de itens extras
    validarExtras = (codigo, cafeQuantidade, sanduicheQuantidade, extras) => {
        if (codigo === 'chantily' && cafeQuantidade === 0) {
            return 'Item extra não pode ser pedido sem o principal';
        }

        if (codigo === 'queijo' && sanduicheQuantidade === 0) {
            return 'Item extra não pode ser pedido sem o principal';
        }

        if (codigo.startsWith('extra_')) {
            const itemPrincipal = codigo.split('_')[1];
            const itemPrincipalQuantidade = itens.find(item =>
                item.startsWith(itemPrincipal)
            );

            if (!itemPrincipalQuantidade) {
                return 'Item extra não pode ser pedido sem o principal';
            }
        }

        return null;
    };

    // Cálculo do valor total da compra
    calcularValorDaCompra(metodoDePagamento, itens) {
        const erroPagamento = this.validarMetodoDePagamento(metodoDePagamento);
        if (erroPagamento) {
            return erroPagamento;
        }

        const erroItens = this.validarItens(itens);
        if (erroItens) {
            return erroItens;
        }

        let valorTotal = 0;
        let extras = {};

        for (const item of itens) {
            const [codigo, quantidade] = item.split(',');

            const erroCardapio = this.validarCodigoCardapio(codigo);
            if (erroCardapio) {
                return erroCardapio;
            }

            const erroQuantidade = this.validarQuantidade(quantidade);
            if (erroQuantidade) {
                return erroQuantidade;
            }

            const { valor } = this.cardapio[codigo];
            valorTotal += valor * quantidade;

            if (codigo === 'cafe' || codigo === 'sanduiche') {
                extras[codigo] = parseInt(quantidade);
                continue;
            }

            const erroExtras = this.validarExtras(
                codigo,
                extras.cafe || 0,
                extras.sanduiche || 0,
                Object.keys(extras)
            );
            if (erroExtras) {
                return erroExtras;
            }

            extras[codigo] = (extras[codigo] || 0) + 1;
        }

        const combos = ['combo1', 'combo2'];
        for (const combo of combos) {
            const comboQuantidade = itens.filter(item =>
                item.startsWith(combo)
            ).length;
            if (comboQuantidade > 0) {
                const comboPreco = this.cardapio[combo].valor * comboQuantidade;
                valorTotal += comboPreco;
            }
        }

        // Aplica desconto/acréscimo dependendo do método de pagamento
        if (metodoDePagamento === 'dinheiro') {
            valorTotal *= 0.95; // Desconto de 5% para pagamento em dinheiro
        } else if (metodoDePagamento === 'credito') {
            valorTotal *= 1.03; // Acréscimo de 3% para pagamento a crédito
        }

        return `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }
}

export { CaixaDaLanchonete };
