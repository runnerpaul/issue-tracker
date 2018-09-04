const halson = require("halson"),
  config = require("config");

  module.exports = {
    makeHAL: makeHAL,
    setupRoutes: setupRoutes
  }


  function setupRoutes(server, swagger, lib) {
    for(controller in lib.controllers) {
      cont = lib.controllers[controller](lib);
      cont.setUpActions(server, swagger);
    }
  }


  function makeHAL(data, links, embed) {
    let obj = halson(data);

    if(links && links.length > 0) {
      links.forEach(lnk => {
        obj.addLink(lnk.name, {
          href: lnk.ref,
          title: lnk.title || ''
        });
      });
    }

    if(embed && embed.length > 0) {
      embed.forEach(item => {
        obj.addEmbed(item.name, item.data);
      });
    }
    return obj;
  }