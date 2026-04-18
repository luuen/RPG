#!/usr/bin/perl
use strict;
use warnings;
use HTTP::Daemon;
use HTTP::Response;
use HTTP::Status;

my $port = 3000;
my $d = HTTP::Daemon->new(LocalPort => $port, LocalAddr => '127.0.0.1', ReuseAddr => 1)
    or die "Cannot start server: $!";

print "Server ready at http://127.0.0.1:$port\n";
STDOUT->flush();

while (my $c = $d->accept) {
    while (my $r = $c->get_request) {
        my $path = $r->url->path;
        $path = '/index.html' if $path eq '/';
        # Prevent directory traversal
        $path =~ s|/\.\./|/|g;
        my $file = '/c/Users/freak/Desktop/Claude' . $path;

        if (-f $file) {
            my $ct = 'text/html; charset=utf-8';
            $ct = 'application/javascript; charset=utf-8' if $file =~ /\.(js|jsx|mjs)$/i;
            $ct = 'text/css; charset=utf-8'               if $file =~ /\.css$/i;
            $ct = 'image/png'                              if $file =~ /\.png$/i;

            open(my $fh, '<:raw', $file) or do { $c->send_error(RC_INTERNAL_SERVER_ERROR); next };
            local $/;
            my $body = <$fh>;
            close $fh;

            my $res = HTTP::Response->new(200, 'OK');
            $res->header('Content-Type'   => $ct);
            $res->header('Cache-Control'  => 'no-cache');
            $res->header('Access-Control-Allow-Origin' => '*');
            $res->content($body);
            $c->send_response($res);
        } else {
            $c->send_error(RC_NOT_FOUND);
        }
    }
    $c->close;
    undef $c;
}
