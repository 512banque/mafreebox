<?php

error_reporting(E_ALL);

require_once('lib/Mafreebox.php');

function get_arg($idx=1, $default=false){
	if(isset($_SERVER["argv"][$idx]))
		return $_SERVER["argv"][$idx];
	return $default;
		
}

function file_rotate($file, $count, $dir='var/'){

	$infos = pathinfo($file);
	$files = glob(sprintf('%s%s.%s.*',$dir, $infos['filename'],$infos['extension']));
	# sort($files, SORT_NATURAL);
	natcasesort($files);
	$files = array_reverse($files);

	foreach($files as $i => $f){
		if((count($files) -$i) > $count-1){
			printf("## unlinking file $f \n");
			# unlink($f);
		}
		else {
			$base = basename($f);
			$inf = pathinfo($f);
			$id = $inf['extension'];
			$name = sprintf("%s/%s", $inf['dirname'], $inf['filename']);
			$f1 = sprintf("%s.%s", $name, $id);
			$f2 = sprintf("%s.%s", $name, $id+1);
			# printf("## rename %s -> %s\n", $f1, $f2 );
			if(file_exists($f1)) rename($f1, $f2);
		}
	}
	
	$path = sprintf('%s%s',$dir, $file);
	if(file_exists($path)) rename($path, $path.'.1');
}

# mettre les paramêtres de connexion de préférence dans le fichier de configuration 
# valable surtout quand on contribue au source (dépot GIT par exemple).
#
$config_file = sprintf('%s/.config/mafreebox.cfg', getenv('HOME'));
if(file_exists($config_file)){
	require_once($config_file);
} else
	$config = array(
		'url'      => 'http://mafreebox.freebox.fr/',
		'user'     => 'freebox',
		'password' => '123456'
	);

$freebox = new Mafreebox($config['url'], $config['user'], $config['password']);

print_r($freebox->exec('conn.status')); exit(0);
# print_r($freebox->exec('system.fw_release_get')); exit(0);
# print_r($freebox->reboot()); exit(0);
# print_r($freebox->exec( 'fs.list', array('/'))); exit(0);
# print_r($freebox->exec( 'fs.list', array('/Disque dur/'))); exit(0);

// Listons le contenu du disque dur interne de la Freebox.
# $contenu = $freebox->exec( 'fs.list', array('/Disque dur/Enregistrements') );
# print_r($contenu);

# print_r($freebox->exec( 'conn.logs' ));


/*
	period = {hour|day|week}
	type={rate|snr}
	dir={down|up}

*/

function rrd_daily($freebox){
	$f = 'rrd-rate-day-up.png';   file_rotate("$f", 31); file_put_contents("var/$f", $freebox->rrd_graph($type='rate', $period='day', $dir='up'));
	$f = 'rrd-rate-day-down.png'; file_rotate("$f", 31); file_put_contents("var/$f", $freebox->rrd_graph($type='rate', $period='day', $dir='down'));
	$f = 'rrd-snr-day.png';       file_rotate("$f", 31); file_put_contents("var/$f", $freebox->rrd_graph($type='snr',  $period='day'));
}

function rrd_hourly($freebox){
	# $f = 'rrd-rate-hourly-up.png';   file_rotate("$f", 24); file_put_contents("var/$f", $freebox->rrd_graph($type='rate', $period='hour', $dir='up'));
	$f = 'rrd-rate-hourly-down.png'; file_rotate("$f", 24); file_put_contents("var/$f", $freebox->rrd_graph($type='rate', $period='hour', $dir='down'));
	# $f = 'rrd-snr-hourly.png';       file_rotate("$f", 24); file_put_contents("var/$f", $freebox->rrd_graph($type='snr',  $period='hour'));

	# $f = 'rrd-wan-rate-hourly-up.png';   file_rotate("$f", 24); file_put_contents("var/$f", $freebox->rrd_graph($type='wan-rate', $period='hour', $dir='up'));
	# $f = 'rrd-wan-rate-hourly-down.png'; file_rotate("$f", 24); file_put_contents("var/$f", $freebox->rrd_graph($type='wan-rate', $period='hour', $dir='down'));

}

switch(get_arg(1, 'daily')){

	case 'hour': 
	case 'hourly': 
		rrd_hourly($freebox);
		break;

	case 'day': 
	case 'daily': 
		rrd_dayly($freebox);
		break;

	case 'week': 
	case 'weekly': 
		rrd_weekly($freebox);
		break;

	case 'test': 
	case 'debug': 
		# $freebox->debug();
		# print_r($freebox->dhcp()->status_get());
		# print_r($freebox->dhcp()->leases_get());
		# print_r($freebox->dhcp()->sleases_get());
		# print_r($freebox->download()->_list());
		
		$args = array(
			'max_up' => 90,
			'download_dir' => '/Disque dur/Téléchargements',
			'max_dl' => 2234,
			'max_peer' => 240,
			'seed_ratio' => 2
		);
		# print_r($freebox->download()->http_add('ubuntu.iso', 'ftp://ftp.free.fr/mirrors/ftp.ubuntu.com/releases/12.10/ubuntu-12.10-desktop-i386.iso'));
		print_r($freebox->download()->_list());
		$id = 849;
		$type='http';
		# print_r($freebox->download()->stop($type, $id));
		# print_r($freebox->download()->start($type, $id));
		# print_r($freebox->download()->remove($type, $id));
		$url = 'http://ftp.free.fr/mirrors/ftp.ubuntu.com/releases/12.10/ubuntu-12.10-desktop-armhf%2bomap4.img.torrent';
		print_r($freebox->download()->torrent_add($url));

		# print_r($freebox->download()->config_get());
		# print_r($freebox->download()->config_set($args));

		# print_r($cfg = $freebox->ftp()->get_config());
		# print_r($freebox->ftp()->set_config($cfg));
		
		# print_r($freebox->system()->uptime_get());
		# print_r($freebox->system()->mac_address_get());
		# print_r($freebox->system()->fw_release_get());

		# print_r($freebox->phone()->fxs_ring(false));


		break;
}


?>