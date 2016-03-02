var sys = require('util'),
    cp = require('child_process'),
    os = require('os');

exports.writeState = function writeState(command, cb) {
        var p = os.platform();
        var ls = null;
        var outstring = "";
        var cmd = "writestate," + command;
        var arg = cmd.toString().split(",");
        
        if (p === 'linux') {
            //linux
            ls = cp.spawn('/usr/local/bin/sclibridge', arg);
        } else if (p === 'darwin') {
            //mac osx
            ls = cp.spawn('/Users/RPM/Applications/RacePointMedia/sclibridge', arg);
        } else {
            //other
            var err = new Error('Unsupported OS system...');
            cb(err, null);
        }

        ls.on('error', function (e) {
            var err = new Error('savant.writestate: there was an error while executing the writestate program. check the path or permissions...');
            cb(err, null);
        });

  
        ls.stdout.on('data', function (data) {
            outstring += String(data);
        });

        ls.stderr.on('data', function (data) {
          //sys.print('stderr: ' + data);
        });

        ls.on('exit', function (code) {
            var result;
            result = (code === 0) ? true : false;
           
            if (cb) {
                cb(null, result);
            }
        });
}

exports.serviceRequest = function serviceRequest(command, cb) {
        var p = os.platform();
        var ls = null;
        var outstring = "";
        var cmd = "servicerequest," + command;
        var arg = cmd.toString().split(",");
        
        if (p === 'linux') {
            //linux
            ls = cp.spawn('/usr/local/bin/sclibridge', arg);
        } else if (p === 'darwin') {
            //mac osx
            ls = cp.spawn('/Users/RPM/Applications/RacePointMedia/sclibridge', arg);
        } else {
            //other
            var err = new Error('Unsupported OS system...');
            cb(err, null);
        }

        ls.on('error', function (e) {
            var err = new Error('savant.serviceRequest: there was an error while executing the serviceRequest program. check the path or permissions...');
            cb(err, null);
        });

  
        ls.stdout.on('data', function (data) {
            outstring += String(data);
        });

        ls.stderr.on('data', function (data) {
          //sys.print('stderr: ' + data);
        });

        ls.on('exit', function (code) {
            var result;
            result = (code === 0) ? true : false;
           
            if (cb) {
                cb(null, result);
            }
        });
}

exports.readState = function readState(command, cb) {
        var p = os.platform();
        var ls = null;
        var outstring = "";
        var cmd = "readstate," + command;
        var arg = cmd.toString().split(",");
        
        if (p === 'linux') {
            //linux
            ls = cp.spawn('/usr/local/bin/sclibridge', arg);
        } else if (p === 'darwin') {
            //mac osx
            ls = cp.spawn('/Users/RPM/Applications/RacePointMedia/sclibridge', arg);
        } else {
            //other
            var err = new Error('Unsupported OS system...');
            cb(err, null);
        }

        ls.on('error', function (e) {
            var err = new Error('savant.readstate: there was an error while executing the readstate program. check the path or permissions...');
            cb(err, null);
        });

  
        ls.stdout.on('data', function (data) {
            outstring += String(data);
        });

//        ls.stderr.on('data', function (data) {
          //sys.print('stderr: ' + data);
//        });




        ls.on('exit', function (code) {
            var result;
            result = outstring;//(code === 0) ? true : false;
           
            if (cb) {
                cb(null, result);
            }
        });
}