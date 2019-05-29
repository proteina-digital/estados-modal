var ufs = '<option value="AC">AC</option><option value="AL">AL</option><option value="AM">AM</option><option value="AP">AP</option><option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option><option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option><option value="RO">RO</option><option value="RS">RS</option><option value="RR">RR</option><option value="SC">SC</option><option value="SE">SE</option><option value="SP">SP</option><option value="TO">TO</option>';

var ddds = {
    "AC": ["68"],
    "AL": ["82"],
    "AM": ["92", "97"],
    "AP": ["96"],
    "BA": ["71", "73", "74", "75", "77"],
    "CE": ["85", "88"],
    "DF": ["61"],
    "ES": ["27", "28"],
    "GO": ["62", "64"],
    "MA": ["98", "99"],
    "MG": ["31", "32", "33", "34", "35", "37", "38"],
    "MS": ["67"],
    "MT": ["65", "66"],
    "PA": ["91", "93", "94"],
    "PB": ["83"],
    "PE": ["81", "87"],
    "PI": ["86", "89"],
    "PR": ["41", "42", "43", "44", "45", "46"],
    "RJ": ["21", "22", "24"],
    "RN": ["84"],
    "RO": ["69"],
    "RR": ["95"],
    "RS": ["51", "53", "54", "55"],
    "SC": ["47", "48", "49"],
    "SE": ["79"],
    "SP": ["11", "12", "13", "14", "15", "16", "17", "18", "19"],
    "TO": ["63"]
}

$(document).on('change', '.escolha-estado', function(event) {
  event.preventDefault();
  var uf = $(this).val();

  if (ddds[uf].length > 0) {
    var select_ddd = $(".escolha-ddd");
    select_ddd.find("option").first().text("DDD");
        select_ddd.find('option').not(':first').remove();
    for (var i = 0; i < ddds[uf].length; i++) {
      select_ddd.append('<option value="'+ddds[uf][i]+'">'+ddds[uf][i]+'</option>');
    }
  }

});

$(document).on('change', '.escolha-ddd', function(event) {
  event.preventDefault();
});

function checa_cookie_ddd(){
  if( _GETURL("uf") ){
    $(".modal-ddd").css('display', 'none');
    $(".place-uf").html(_GETURL("uf").toUpperCase());
    get_precos(ddds[_GETURL("uf").toUpperCase()][0], _GETURL("uf").toUpperCase(), null);
    return true;
  }else{

    if (readCookie('ddd') && readCookie('uf')) {
      $(".modal-ddd").css('display', 'none');
      $(".place-uf").html(readCookie('uf'));
      get_precos(readCookie('ddd'), readCookie('uf'), null);
      return true;
    }else{
      $(".modal-ddd").css('display', 'block');
      return false;
    }
  }
}

function trata_preco_api(valor){
  var valores = valor.toString().split(".");
  return [valores[0], valores[1]];
}

var get_precos = function(ddd, uf, cidade){
  var serializeDados = {"uf": uf,"cidade": cidade,"ddd": ddd};
  var btn = $(".form-ddd-btn");

  console.log(serializeDados);

  $.ajax({
    url: 'https://catalogo-vivo.automatuslab.com/api/Catalogo/DisponibilidadeMovel',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    type: 'POST',
    // cache: true,
    data: JSON.stringify(serializeDados),
    beforeSend: function() {
      btn.val( "Aguarde..." );
    },
    success: function(data, textStatus) {

        var box_destaque = $(".area-boxes").children(":first");
        var box_destaque_class = box_destaque.attr('class');
        var box_destaque_style = box_destaque.attr('style');
      var box_destaque_html = box_destaque.html();
      $(".area-boxes").find(".destaque").remove();

      // var promocional

      for (var i = 0; i < data.portfolio.controle.length; i++) {
        // Pula o loop quando não for fatura digital
        if (data.portfolio.controle[i]["info_plano"]["tipo_fatura"] == "Digital" && data.portfolio.controle[i]["info_plano"]["view"] == "TRUE" ) {

          console.log("DADOS: "+data.portfolio.controle[i]["info_plano"]["tipo_fatura"]);

          $(".area-boxes").append("<div class='"+box_destaque_class+"' style='"+box_destaque_style+"'>"+box_destaque_html+"</div>");

          $(".area-boxes").find(".destaque").last().attr('data-sku', data.portfolio.controle[i]["sku"]);

          $(".area-boxes").find(".destaque").last().find(".dados").html(data.portfolio.controle[i]["info_plano"]["dados"]);
          $(".area-boxes").find(".destaque").last().find(".dados_detalhe").html(data.portfolio.controle[i]["info_plano"]["dados_detalhe"]);
          $(".area-boxes").find(".destaque").last().find(".titulo-destaque").html(data.portfolio.controle[i]["info_plano"]["titulo"]);
          $(".area-boxes").find(".destaque").last().find(".descricao-destaque").html(data.portfolio.controle[i]["info_plano"]["descricao"]);
          $(".area-boxes").find(".destaque").last().find(".preco-destaque").html( trata_preco_api(data.portfolio.controle[i]["valores_plano"]["valor_oferta"])[0] );
          $(".area-boxes").find(".destaque").last().find(".centavos").html(","+trata_preco_api(data.portfolio.controle[i]["valores_plano"]["valor_oferta"])[1]+"<br> /mês");

          $(".area-boxes").find(".destaque").last().find(".btn-assine-ja").attr("data-preco", data.portfolio.controle[i]["valores_plano"]["valor_oferta"]).attr("data-ddd", ddd).attr("data-uf", uf).attr('data-sku', data.portfolio.controle[i]["sku"]);


              var app = $(".area-boxes").find(".destaque").last().find(".apps-conteudo");
              app.find('img').remove();
              if (data.portfolio.controle[i]["info_plano"]["apps"] != null) {
                for (var a = 0; a < data.portfolio.controle[i]["info_plano"]["apps"]["imagens"].length; a++) {
                    app.append("<img class='apps' src='https://automatuslab.blob.core.windows.net/vivofluxoonline/"+data.portfolio.controle[i]["info_plano"]["apps"]["imagens"][a]+"'>");
                }
                app.find('img').last().addClass('ultimo');  
              }
              


          var detalhes_lista = $(".area-boxes").find(".destaque").last().find(".ul-lista.detalhes");
              detalhes_lista.find("li").remove();
              for (var d = 0; d < data.portfolio.controle[i]["info_plano"]["detalhe"].length; d++) {
                  detalhes_lista.append("<li class='lista'>"+data.portfolio.controle[i]["info_plano"]["detalhe"][d]+"</li>");
              }
              detalhes_lista.children(":last").addClass('ultimo');



        }else if(data.portfolio.controle[i]["info_plano"]["tipo_fatura"] == "Digital" && data.portfolio.controle[i]["info_plano"]["view"] == "FALSE"){

          var modal_promo = $(".modal-promocional");

          modal_promo.find(".modal-promo-dados").html( trata_preco_api(data.portfolio.controle[i]["info_plano"]["dados"]) );
          modal_promo.find(".modal-promo-plano-detalhe").html( trata_preco_api(data.portfolio.controle[i]["info_plano"]["dados_detalhe"]) );


          if (data.portfolio.controle[i]["info_plano"]["apps"] != null) {
            modal_promo.find(".modal-promo-images").empty();

            for (var a = 0; a < data.portfolio.controle[i]["info_plano"]["apps"]["imagens"].length; a++) {
                modal_promo.find(".modal-promo-images").append("<img class='modal-promo-img' src='https://automatuslab.blob.core.windows.net/vivofluxoonline/"+data.portfolio.controle[i]["info_plano"]["apps"]["imagens"][a]+"'>");
            }
          }

          // modal_promo.find(".modal-promo-branco.beneficios-principal").html(trata_preco_api(data.portfolio.controle[i]["valores_plano"]["valor_oferta"])[0] );

          modal_promo.find(".modal-promo-valor").html(trata_preco_api(data.portfolio.controle[i]["valores_plano"]["valor_oferta"])[0] );
          modal_promo.find(".modal-promo-cents").html(","+trata_preco_api(data.portfolio.controle[i]["valores_plano"]["valor_oferta"])[1] );

          $(".modal-promo-btn").attr("data-preco", data.portfolio.controle[i]["valores_plano"]["valor_oferta"]).attr("data-ddd", ddd).attr("data-uf", uf).attr('data-sku', data.portfolio.controle[i]["sku"]);

        } //FIM IF

      }

      if(page_is('home_b')) {
        $('#gigas').html(data.portfolio.controle[0]["info_plano"]["dados"]);
        $(".b_destque_real").html( trata_preco_api(data.portfolio.controle[0]["valores_plano"]["valor_oferta"])[0] );
        $(".b_destaque_cents").html( ","+trata_preco_api(data.portfolio.controle[0]["valores_plano"]["valor_oferta"])[1]  );
        $(".btn-assine-ja.abre_loja.nodestaque").attr("data-preco", data.portfolio.controle[0]["valores_plano"]["valor_oferta"]).attr("data-ddd", ddd).attr("data-uf", uf).attr('data-sku', data.portfolio.controle[0]["sku"]);
      }


      if (data.portfolio.controle.length > 0) {

        if (parseInt(ddd) == 42 || parseInt(ddd) == 47 || parseInt(ddd) == 48 || parseInt(ddd) == 49) {
          $(".hide_only_sc_flex").css('display', 'none');
          $(".hide_only_sc").css('display', 'none');
          $(".show_only_sc").css('display', 'block');
        } else {
          $(".hide_only_sc_flex").css('display', 'flex');
          $(".hide_only_sc").css('display', 'block');
          $(".show_only_sc").css('display', 'none');
        }


        $(".modal-ddd").css('display', 'none');
        $(".area-boxes").removeClass('blur');

            $(".place-uf").html(uf);

            document.cookie = "uf = "+uf+"; path=/";
            document.cookie = null;
            document.cookie = "ddd = "+ddd+"; path=/";
      }


    },
    error: function(xhr,er) {
      console.log('Error ' + xhr.status + ' - ' + xhr.statusText + ' - Tipo de erro: ' + er);
    },
    complete: function(){
        btn.val( "Continuar" );
    }
  });     
}

$('form[name="wf-form-Formulario-DDD"]').submit(function(event) {
  var form = $(this);

  var ddd = form.find("select[name='escolha_ddd'] option:selected").val();
  var uf = form.find("select[name='escolha_estado'] option:selected").val();
  var cidade = null;

  get_precos(ddd, uf, cidade);

  event.preventDefault();
  return false;
});

$(document).on('click', '.fechar-modal-ddd', function(event) {
  if (checa_cookie_ddd() == false) {
    get_precos(21, 'RJ', null);
  }
});



$(document).ready(function() {
    $(".escolha-estado").append(ufs);
    checa_cookie_ddd();
});
