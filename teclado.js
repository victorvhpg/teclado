//@victorvhpg
//https://github.com/victorvhpg/teclado/blob/master/teclado.js
var teclado = (function(window) {
    "use strict";
    var Date = window.Date;
    var document = window.document;
    var _vetSequencia = [];
    var teclado = {
        teclas: {
            ESQUERDA: 37,
            CIMA: 38,
            DIREITA: 39,
            BAIXO: 40,
            ESPACO: 32
        },
        teclasPressionadas: {},
        estaPressionada: function(keyCode) {
            return this.teclasPressionadas[keyCode];
        },
        //verifica se ja apertou a sequencia em algum momento
        pressionouSequenciaEmAlgumMomento: function(vetSequenciaTeclasProcura, tempoMaximoEntreCadaSequencia) {
            var totalSequenciaProcura = vetSequenciaTeclasProcura.length,
                    i = 0, l = _vetSequencia.length, contSeqProcura, posInicioDaProcura,
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
                    tecla = _vetSequencia[i];//tecla que ja foi apertada
                    //verifica se a tecla apertada satisfaz a da sequencia atual 
                    //no tempo tempoMaximoEntreCadaSequencia
                    if (tecla.keyCode === vetSequenciaTeclasProcura[contSeqProcura]
                            && ((tecla.tempoQuandoApertou - tempoDaTeclaAnterior) <= tempoMaximoEntreCadaSequencia)) {
                        tempoDaTeclaAnterior = tecla.tempoQuandoApertou;
                        contSeqProcura++;
                        i++;
                        //se ja achou todas que procura entao ja retorna true
                        if (contSeqProcura === totalSequenciaProcura) {
                            return true;
                        }
                    } else {
                        tempoDaTeclaAnterior = Date.now();
                        //nao achou a partir de 'posInicioDaProcura'
                        //entao sai do laco e comeca a busca a partir de posInicioDaProcura+1
                        break;
                    }
                } while (i < l);
                //se passar aqui eh que a sequencia a partir de posInicioDaProcura nao 
                //satisfaz a sequencia procurada entao tenta a partir de +1 da ultima 
                //tentativa de busca (posInicioDaProcura)
                i = posInicioDaProcura + 1;
            }
            return false;
        },
        //verifica se o usuario pressionou uma sequencia de teclas 
        ///e o intervalo de tempo entre  cada tecla apertada nao deve se maior 
        // que 'tempoMaximoEntreCadaSequencia' e o tempo decorrido desde
        //  a ultima tecla pressionada nao pode ser maior  q tempoMaximoDecorridoDaUltimaTeclaEmRelacaoAgora
        //por exemplo  verifica se o usuario pressionou a sequencia do HADOUKEN
        pressionouSequencia: function(vetSequenciaTeclasProcura, tempoMaximoEntreCadaSequencia, tempoMaximoDecorridoDaUltimaTeclaEmRelacaoAgora) {
            var totalSequenciaProcura = vetSequenciaTeclasProcura.length,
                    contSeqProcura = 0,
                    tecla,
                    l = _vetSequencia.length,
                    tempoDaTeclaAnterior = Date.now();
            if (totalSequenciaProcura > _vetSequencia.length || totalSequenciaProcura === 0) {
                return false;
            }
            for (var i = (l - totalSequenciaProcura); i < l; i++) {
                tecla = _vetSequencia[i];//tecla que ja foi apertada				
                if (tecla.keyCode === vetSequenciaTeclasProcura[contSeqProcura]
                        && ((tecla.tempoQuandoApertou - tempoDaTeclaAnterior) <= tempoMaximoEntreCadaSequencia)) {
                    contSeqProcura++;
                    tempoDaTeclaAnterior = tecla.tempoQuandoApertou;
                } else {
                    return false;
                }
            }
            if (contSeqProcura > 0 && contSeqProcura === totalSequenciaProcura) {
                var agora = Date.now();
                var tempoDecorridaDaUltimaTecla = agora - _vetSequencia[ l - 1 ].tempoQuandoApertou;
                return  (tempoDecorridaDaUltimaTecla <= tempoMaximoDecorridoDaUltimaTeclaEmRelacaoAgora);
            }
            return false;
        },
        pressionaTecla: function(keyCode) {
            if (this.estaPressionada(keyCode)) {
                return;
            }
            _vetSequencia.push({
                keyCode: keyCode,
                tempoQuandoApertou: Date.now()
            });
            this.teclasPressionadas[keyCode] = true;
        },
        soltaTecla: function(keyCode) {
            this.teclasPressionadas[keyCode] = false;
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
                this.teclasPressionadas[this.teclas[i]] = false;
            }
            document.addEventListener("keydown", function(e) {
                var keyCode = e.which;
                if (that.isTeclaValida(keyCode)) {
                    teclado.pressionaTecla(e.which);
                    e.preventDefault();
                }
            });
            document.addEventListener("keyup", function(e) {
                var keyCode = e.which;
                if (that.isTeclaValida(keyCode)) {
                    teclado.soltaTecla(e.which);
                    e.preventDefault();
                }
            });
            return this;
        }};
    return teclado.init();
}(window));