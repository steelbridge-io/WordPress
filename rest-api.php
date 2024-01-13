<?php

/**
 * URL variable
 *
 * @var string $url The URL to be assigned to the variable
 *
 * @since 1.0.0
 *
 *        Faster fetch from rest-api of post content where content is retrieved prior to page load.
 */

// The URL of the REST API endpoint
$url = "https://theflyshop.local/wp-json/wp/v2/posts?per_page=1";

// Create a stream context that disables SSL verification.
// COMMENT OUT IN PRODUCTION!!!!!
$context = stream_context_create( array(
	'ssl' => array(
		'verify_peer'      => FALSE,
		'verify_peer_name' => FALSE,
	),
) );

// Use file_get_contents to GET the URL in question.
$contents = file_get_contents( $url, FALSE, $context );

// In case of an error, add some logging
if ( $contents === FALSE ) {
	$error = error_get_last();
	echo "Error: " . $error['message']; // only for debugging purpose
} else {
	// Decode the JSON response into a PHP array/object
	$posts = json_decode( $contents );
	
	// Fetch the featured media for each post.
	foreach ( $posts as $post ) {
		$mediaContents
			= file_get_contents( "https://theflyshop.local/wp-json/wp/v2/media/{$post->featured_media}",
			FALSE,
			$context );
		if ( $mediaContents !== FALSE ) {
			$media                    = json_decode( $mediaContents );
			$post->featured_image_url = $media->source_url;
		}
	}
}
?>


<div id="posts">
	<?php foreach ($posts as $post): ?>
		<div class="card">
			<img class="card-img-top" src="<?= $post->featured_image_url ?>" alt="<?= $post->title->rendered ?>">
			<div class="card-body">
				<h5 class="card-title"><?= $post->title->rendered ?></h5>
				<div class="card-text"><?= $post->excerpt->rendered ?></div>
				<a href="<?= $post->link ?>" class="btn btn-primary">Read More</a>
			</div>
		</div>
	<?php endforeach; ?>
</div>

