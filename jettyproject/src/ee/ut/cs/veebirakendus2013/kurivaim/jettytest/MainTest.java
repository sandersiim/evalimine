package ee.ut.cs.veebirakendus2013.kurivaim.jettytest;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.servlets.TestServlet;

public class MainTest {
    public static void main(String[] args) throws Exception {
        Server server = new Server(8080);
 
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);
 
        context.addServlet(new ServletHolder(new TestServlet()),"/*");
        context.addServlet(new ServletHolder(new TestServlet("Buongiorno Mondo")),"/it/*");
        context.addServlet(new ServletHolder(new TestServlet("Bonjour le Monde")),"/fr/*");
        
        server.start();
        server.join();
    }
}
