package ee.ut.cs.veebirakendus2013.kurivaim.jettytest;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.servlets.TestServlet;

//how to query this: localhost:8080/dyn/querytype/json={}
//sample JSON queries:
//status, json: {}
//full path: localhost:8080/dyn/status
//login, json: {"username":"testuser", "password":"testpass"}
//full path: localhost:8080/dyn/login?json=%7B%22username%22%3A%22testuser%22%2C%20%22password%22%3A%22testpass%22%7D

public class MainTest {
    public static void main(String[] args) throws Exception {
    	Server server = new Server(8080);
 
    	ServletContextHandler contextHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);
    	contextHandler.setContextPath("/dyn");
		contextHandler.addServlet(new ServletHolder(new TestServlet()), "/*");
		
		ResourceHandler resourceHandler = new ResourceHandler();
		resourceHandler.setResourceBase("../html/");
		
		HandlerList handlers = new HandlerList();
		handlers.addHandler(contextHandler);
		handlers.addHandler(resourceHandler);
		
		server.setHandler(handlers);
		
		server.start();
		server.join();
    }
}
