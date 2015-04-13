function priorityButton (e) {
   var $button = e? $(this) : $('#priority .btn');
   var $input = $button.find('input:checkbox');
   if (e){
	   $input.prop("checked", !$input.prop("checked"));
   }
   if ($input.prop("checked"))
   {
	   $button.removeClass("btn-default").addClass("btn-danger");
	   $button.find(".glyphicon").removeClass("alert-danger");
	   if (!e) $button.addClass('active');
   } else {
	   $button.addClass("btn-default").removeClass("btn-danger");
	   $button.find(".glyphicon").addClass("alert-danger");
	   if (!e) $button.removeClass('active');
   }
}

function loadArticles ($current) {
	var id = $current.find('input[name="id"]').val();
	var serviceId = $current.find('input[name="service-id"]').val();
	
    var $target = $('#articoli');
    var request = {id : id, 'service-id': serviceId};
    var url = '/hd0/test/frontend/getArticles';  /* todo@businessLogic */
    
    $.ajax({
        type: 'post',
        url: url,
        data: request,
        success: function (data, status) {
        	window.console&&console.log(data);
            return showArticles (data, status, $target, $current );
        }
    });
}

function showArticles (articoli, status, $target, $current)
{
	$articolo = $target.find('.mock');
	$articolo.siblings().remove();

	var addArticle = "Per inviare nuovi aggiornamenti invia una mail a <b><a href='mailto://%mailservice%'>%mailservice%</a></b> (anche con allegati) dal tuo indirizzo di posta <b>%mail%</b> incollando come <b>Oggetto</b> della mail quanto segue: <br/><b><u>Re: Subject [Ticket#%num%]</u></b>";
	var num = $current.find('input[name="num"]').val();
	var mail = $('#auth_email').val();
	addArticle = addArticle.replace(/%mailservice%/g,'hd0@zenatek.com').replace('%mail%',mail).replace('%num%',num);

    $("a[data-toggle='alert']").on('click', function(e){
             var alert = {'alert-info': addArticle};
             alertHint( $current.find('span[name="feedback"]'), alert );
        });
	
	$.each(articoli, function(k,a){
			// create		  
	        var $clone = $articolo.clone().removeClass('mock').removeClass('hidden');
	        $target.prepend(updateArticle(a, $clone));
		});
	$current.find('input:hidden[name="articles"]').val(articoli.length);
	$target.find('[role="tabpanel"]:first').collapse('show');
}

function updateArticle (a, $articolo)
{
	$articolo.find('.panel-heading')
	   .attr('id', 'h_a'+ a['ArticleID']);
	$articolo.find('a[aria-controls]')
	   .attr('aria-controls', 'a'+ a['ArticleID'])
	   .attr('href', "#"+ 'a'+ a['ArticleID']);
	   
    var author = escapeHtml(a['FromRealname']);
	if (a['From'].indexOf( $('#auth_email').val() ) > -1) {
		author = $('#auth_name').val();
	}
   $articolo.find('span[data-name="authorName"]').text(author);

	   
	$articolo.find('span[data-name="created"]')
	   .text(a['Created']);
	   
	$articolo.find('[role="tabpanel"]')
	   .attr('id', 'a'+ a['ArticleID'])
	   .attr('aria-labelledby', 'h_a'+ a['ArticleID']);
	$articolo.find('span[data-name="body"]')
	   .empty().html(a['Body'].replace(/\n/g, "<br/>"));
	return $articolo;
}