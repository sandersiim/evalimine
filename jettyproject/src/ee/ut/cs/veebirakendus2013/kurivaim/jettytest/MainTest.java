package ee.ut.cs.veebirakendus2013.kurivaim.jettytest;

import java.io.File;
import java.util.EnumSet;

import javax.servlet.DispatcherType;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.FilterHolder;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.servlets.MultiPartFilter;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.servlets.TestServlet;

public class MainTest {
	public static void main(String[] args) throws Exception {
		Server server = new Server(8080);
		
		MysqlConnectionHandler sqlHandler = new MysqlConnectionHandler();
		
		FilterHolder filterHolder = new FilterHolder(new MultiPartFilter());
		filterHolder.setInitParameter("deleteFiles", "true");
		
		ServletContextHandler contextHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);
		contextHandler.setContextPath("/dyn");
		contextHandler.addServlet(new ServletHolder(new TestServlet(sqlHandler)), "/*");
		contextHandler.setAttribute("javax.servlet.context.tempdir", new File("../temp"));
		contextHandler.addFilter(filterHolder, "/photo", EnumSet.of(DispatcherType.REQUEST));
		
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
