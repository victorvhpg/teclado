var Teclado = (function(window) {
    "use strict";
    var document = window.document;
    var _teclas = {
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ESPACO: 32,
        ESQUERDA: 37,
        CIMA: 38,
        DIREITA: 39,
        BAIXO: 40,
        A: 65,
        D: 68,
        S: 83,
        W: 87
    };
    var Teclado = function(teclasMonitorar) {
        this.vetSequencia = [];
        this.teclas = teclasMonitorar || _teclas;
        this.teclasPressionadas = {};
        this.init();
    };
    Teclado.teclas = _teclas;
    Teclado.prototype = {
        constructor: Teclado,
        teclasPressionadas: {},
        estaPressionada: function(keyCode) {
            return this.teclasPressionadas[keyCode].pressionada && !this.teclasPressionadas[keyCode].naoPodePressionarAteSoltar;
        },
        desabilitaAteSoltar: function(keyCode) {
            this.soltaTecla(keyCode);
            this.teclasPressionadas[keyCode].naoPodePressionarAteSoltar = true;
        },
        //verifica se ja apertou a sequencia em algum momento
        //vetSequenciaTeclasProcura array de teclas que formam a sequencia
        //tempoMaximoEntreCadaTecla limite de tempo entre cada tecla pressionada
        pressionouSequenciaEmAlgumMomento: function(vetSequenciaTeclasProcura, tempoMaximoEntreCadaTecla) {
            var totalSequenciaProcura = vetSequenciaTeclasProcura.length,
                    i = 0,
                    l = this.vetSequencia.length,
                    contSeqProcura,
                    posInicioDaProcura,
                    tempoDaTeclaAnterior = Date.now(),
                    tecla;
            //percorre todas as teclas que ja foram apertadas
            while (i < l) {
                //contador de teclas  que foram apertadas em sequencia
                contSeqProcura = 0;
                //posicao que iniciou a busca da sequencia
                posInicioDaProcura = i;
                //para cada tecla apertada verifica  se esta na sequencia procurada
                do {
                    tecla = this.vetSequencia[i]; //tecla que ja foi apertada
                    //verifica se a tecla apertada satisfaz a da sequencia atual
                    //no tempo tempoMaximoEntreCadaSequencia
                    if (tecla.keyCode === vetSequenciaTeclasProcura[contSeqProcura] &&
                            ((tecla.tempoQuandoApertou - tempoDaTeclaAnterior) <= tempoMaximoEntreCadaTecla)) {
                        tempoDaTeclaAnterior = tecla.tempoQuandoApertou;
                        contSeqProcura++;
                        i++;
                        //se ja achou todas que procura entao ja retorna true
                        if (contSeqProcura === totalSequenciaProcura) {
                            return true;
                        }
                    } else {
                        //nao achou a partir de 'posInicioDaProcura'
                        //entao sai do laco e comeca a busca a partir de posInicioDaProcura+1
                        break;
                    }
                } while (i < l);
                //se passar aqui eh que a sequencia a partir de posInicioDaProcura nao
                //satisfaz a sequencia procurada entao tenta a partir de +1 da ultima
                //tentativa de busca (posInicioDaProcura)
                i = posInicioDaProcura + 1;
                tempoDaTeclaAnterior = Date.now();
            }
            return false;
        },
        //verifica se o usuario pressionou uma sequencia de teclas
        //e o intervalo de tempo entre  cada tecla apertada nao deve se maior
        //que 'tempoMaximoEntreCadaTecla' e o tempo decorrido desde
        // a ultima tecla pressionada nao pode ser maior  q tempoMaximoDecorridoDaUltimaTeclaEmRelacaoAgora
        pressionouSequencia: function(vetSequenciaTeclasProcura, tempoMaximoEntreCadaTecla, tempoMaximoDecorridoDaUltimaTeclaEmRelacaoAgora) {
            var totalSequenciaProcura = vetSequenciaTeclasProcura.length,
                    contSeqProcura = 0,
                    tecla,
                    l = this.vetSequencia.length,
                    agora,
                    tempoDecorridoDaUltimaTecla,
                    tempoDaTeclaAnterior = Date.now();
            if (totalSequenciaProcura > this.vetSequencia.length || totalSequenciaProcura === 0) {
                return false;
            }
            for (var i = (l - totalSequenciaProcura); i < l; i++) {
                tecla = this.vetSequencia[i]; //tecla que ja foi apertada
                if (tecla.keyCode === vetSequenciaTeclasProcura[contSeqProcura] &&
                        ((tecla.tempoQuandoApertou - tempoDaTeclaAnterior) <= tempoMaximoEntreCadaTecla)) {
                    contSeqProcura++;
                    tempoDaTeclaAnterior = tecla.tempoQuandoApertou;
                } else {
                    return false;
                }
            }
            if (contSeqProcura > 0 && contSeqProcura === totalSequenciaProcura) {
                agora = Date.now();
                tempoDecorridoDaUltimaTecla = agora - this.vetSequencia[l - 1].tempoQuandoApertou;
                return (tempoDecorridoDaUltimaTecla <= tempoMaximoDecorridoDaUltimaTeclaEmRelacaoAgora);
            }
            return false;
        },
        //retona qual das teclas foi pressionada antes
        getTeclaPressionadaQueFoiPressionadaAntes: function(vetTeclasPressionadas) {
            var posMenor = 0,
                    t = this.teclasPressionadas;
            for (var i = 0, l = vetTeclasPressionadas.length; i < l; i++) {
                //encontrar o menor
                if (t[vetTeclasPressionadas[i]].tempoQuandoApertou < t[vetTeclasPressionadas[posMenor]].tempoQuandoApertou) {
                    posMenor = i;
                }
            }
            return vetTeclasPressionadas[posMenor];
        },
        pressionaTecla: function(keyCode) {
            if (this.estaPressionada(keyCode)) {
                return;
            }
            var agora = Date.now();
            this.teclasPressionadas[keyCode] = {
                pressionada: true,
                soltou: false,
                naoPodePressionarAteSoltar: false,
                tempoQuandoApertou: agora
            };
            this.vetSequencia.push({
                keyCode: keyCode,
                tempoQuandoApertou: agora
            });
        },
        soltaTecla: function(keyCode) {
            this.teclasPressionadas[keyCode] = {
                pressionada: false,
                soltou: true,
                naoPodePressionarAteSoltar: false,
                tempoQuandoApertou: 0
            };
        },
        isTeclaValida: function(keyCode) {
            for (var i in this.teclas) {
                if (this.teclas[i] === keyCode) {
                    return true;
                }
            }
            return false;
        },
        init: function() {
            var that = this;
            for (var i in this.teclas) {
                this.teclasPressionadas[this.teclas[i]] = {
                    pressionada: false,
                    tempoQuandoApertou: 0
                };
            }
            document.addEventListener("keydown", function(e) {

                var keyCode = e.which;
                if (that.isTeclaValida(keyCode) &&
                        !that.teclasPressionadas[keyCode].naoPodePressionarAteSoltar
                        ) {
                    that.pressionaTecla(e.which);
                    e.preventDefault();
                }
            });
            document.addEventListener("keyup", function(e) {
                var keyCode = e.which;
                if (that.isTeclaValida(keyCode)) {
                    that.soltaTecla(e.which);
                    e.preventDefault();
                }
            });
        }
    };
    return Teclado;
}
(window));