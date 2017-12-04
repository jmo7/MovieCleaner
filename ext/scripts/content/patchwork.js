console.log('%c\n\npatchwork.js\n\n', 'font-size: 20px; background-color: gold');

var patch = (function () {
    /*jshint evil: true */

    "use strict";

    var global = new Function("return this;")(), // Get a reference to the global object
        fnProps = Object.getOwnPropertyNames(Function); // Get the own ("static") properties of the Function constructor

    return function (original, originalRef, patches) {

        var ref = global[originalRef] = original, // Maintain a reference to the original constructor as a new property on the global object
            args = [],
            newRef, // This will be the new patched constructor
            i;

        patches.called = patches.called || originalRef; // If we are not patching static calls just pass them through to the original function

        for (i = 0; i < original.length; i++) { // Match the arity of the original constructor
            args[i] = "a" + i; // Give the arguments a name (native constructors don't care, but user-defined ones will break otherwise)
        }

        if (patches.constructed) { // This string is evaluated to create the patched constructor body in the case that we are patching newed calls
            args.push("'use strict'; return (!!this ? " + patches.constructed + " : " + patches.called + ").apply(null, arguments);");
        } else { // This string is evaluated to create the patched constructor body in the case that we are only patching static calls
            args.push("'use strict'; return (!!this ? new (Function.prototype.bind.apply(" + originalRef + ", [{}].concat([].slice.call(arguments))))() : " + patches.called + ".apply(null, arguments));");
        }

        newRef = new (Function.prototype.bind.apply(Function, [{}].concat(args)))(); // Create a new function to wrap the patched constructor
        newRef.prototype = original.prototype; // Keep a reference to the original prototype to ensure instances of the patch appear as instances of the original
        newRef.prototype.constructor = newRef; // Ensure the constructor of patched instances is the patched constructor

        Object.getOwnPropertyNames(ref).forEach(function (property) { // Add any "static" properties of the original constructor to the patched one
            if (fnProps.indexOf(property) < 0) { // Don't include static properties of Function since the patched constructor will already have them
                newRef[property] = ref[property];
            }
        });

        return newRef; // Return the patched constructor
    };

}());



function traceMethodCalls(obj) {
    let handler = {
        get(target, propKey, receiver) {
            console.log('typeof target = ', typeof target);
console.log('\n\n\nproxy::handler::get()\n\ttarget = ', target, '\n\tpropKey = ', propKey, '\n\treceiver = ', receiver);
            const origMethod = target[propKey];
            return function (...args) {
                let result = origMethod.apply(this, args);
                console.log('%method call traced', 'font-size: 30px; background-color: purple; color: white');
                console.log(propKey + JSON.stringify(args) + ' -> ' + JSON.stringify(result));
                return result;
            };
        }
    };
    return new Proxy(obj, handler);
}


console.log('%cpatcher.js', 'font-size: 200%; font-weight: bold' );


var MediaSource = patch(MediaSource, "MediaSourceOriginal", {
    constructed: function () {
console.log('%c\n\nJeff MediaSource\n\n', 'font-size:40px; background-color: salmon');
        let args = [].slice.call(arguments);
		let tmpMS = new (Function.prototype.bind.apply(MediaSourceOriginal, [{}].concat(args)));
console.log('tmpMS = ', tmpMS);


        tmpMS = traceMethodCalls(tmpMS);

//         tmpMS.addEventListenerOrig = tmpMS.addEventListener;
// console.log('%c1', 'font-size: 30px; background-color: purple; color: white');
//         tmpMS.addEventListener = function() {
// console.log('%ctmpMS.addEventListener called', 'font-size: 30px; background-color: purple; color: white', '\n\targuments = ', arguments);
//             let proxyHandler = new Proxy( arguments[1], {
// console.log('%cnewHandler', 'font-size: 30px; background-color: purple; color: white');
//             });
//
//             tmpMS.addEventListenerOrig(arguments[0], proxyHandler, arguments.slice(2));
//         }







//         let proxyMS = new Proxy(tmpMS, {
// //             addEventListener: function(event, handler, pseudo) {
// // console.log('%cMediasource::addEventListener()', 'font-size: 30px; background-color: purple; color: white', 'n\tevent = ', event, '\nhandler = ', handler, '\npsuedo = ', pseudo);
// //                 target.addEventListener(event, handler, pseudo);
// //             },
// //
// //             removeEventListener: function(event, handler, pseudo) {
// // console.log('%cMediasource::removeEventListener()', 'font-size: 30px; background-color: purple; color: white', 'n\tevent = ', event, '\nhandler = ', handler, '\npsuedo = ', pseudo);
// //                 target.removeEventListener(event, handler, pseudo);
// //             },
//
//
//             get: function(target, property) {
//                 console.log('%cMediasource::get('+property+') called', 'font-size: 30px; background-color: purple; color: white');
// console.log('arguments = ', arguments);
//                 return target[property];
//             },
//
//             set: function(target, property, value) {
//                 console.log('%cMediasource::set('+propertyname+', ' + value + ') called', 'font-size: 30px; background-color: purple; color: white');
//                 target[property] = value;
//                 return true;
//             },
//
//             addSourceBuffer: function(mimetype) {
//                   console.log('%cMediasource::set('+addSourceBuffer+') called', 'font-size: 30px; background-color: purple; color: white');
//                   let tmpSB = target.addSourceBuffer(mimetype);
//                 //   let proxySB = new Proxy(tmpSB, {
//                   //
//                 //   });
//                   //
//                 //   window.sourceBuffers = (window.mediaSources || []);
//                 //   window.sourceBuffers.push(proxySB);
//                 //   return proxySB;
//                   window.sourceBuffers = (window.sourceBuffers || []);
//                   window.sourceBuffers.push(proxySB);
//                   return tmpSB
//             }
//         });

// 		window.mediaSources = (window.mediaSources || []);
// 		window.mediaSources.push(proxyMS);
// console.log('%cwindow.mediaSources.length = %s -- window.mediaSources = %O', 'font-size:40px; background-color: salmon', window.mediaSources.length, window.mediaSources);
// // for ( let i = 0; i < window.mediaSources.length; i++ ) {
// // console.log('window.mediaSources['+i+'] = ' , window.mediaSources[i]);
// // 		for ( buffer in window.mediaSources[i].sourceBuffers ) {
// // console.log('buffer = ', buffer);
// // 		}
// // }
// 		return proxyMS;

        window.mediaSources = (window.mediaSources || []);
 		window.mediaSources.push(tmpMS);
        return tmpMS;
    }
});