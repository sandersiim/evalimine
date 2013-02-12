package ee.ut.cs.veebirakendus2013.kurivaim.jettytest;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.servlets.TestServlet;

//how to query this: localhost:8080/?jsonData=4&jsonData2=8
//sample JSON strings:
//{"queryType":"status"}
//full path: localhost:8080/?jsonData=%7B%22queryType%22%3A%22status%22%7D
//{"queryType":"login", "username":"testuser", "password":"testpass"}
//full path: localhost:8080/?jsonData=%7B%22queryType%22%3A%22login%22%2C%20%22username%22%3A%22testuser%22%2C%20%22password%22%3A%22testpass%22%7D

public class MainTest {
    public static void main(String[] args) throws Exception {
        Server server = new Server(8080);
 
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);
 
        context.addServlet(new ServletHolder(new TestServlet()), "/*");
        
        server.start();
        server.join();
    }
}
