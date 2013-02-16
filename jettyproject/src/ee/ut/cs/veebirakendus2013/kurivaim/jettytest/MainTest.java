package ee.ut.cs.veebirakendus2013.kurivaim.jettytest;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.servlets.TestServlet;

public class MainTest {
	public static void main(String[] args) throws Exception {
		Server server = new Server(8080);
		
		MysqlConnectionHandler sqlHandler = new MysqlConnectionHandler();
		
		ServletContextHandler contextHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);
		contextHandler.setContextPath("/dyn");
		contextHandler.addServlet(new ServletHolder(new TestServlet(sqlHandler)), "/*");
		
		ResourceHandler resourceHandler = new ResourceHandler();
		resourceHandler.setResourceBase("../html/");
		
		HandlerList handlers = new HandlerList();
		handlers.addHandler(contextHandler);
		handlers.addHandler(resourceHandler);
		
		server.setHandler(handlers);
		
		server.start();
		server.join();
		
		sqlHandler.disconnect();
	}
}
