package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.servlets;

import java.io.IOException;
import java.security.cert.X509Certificate;
import java.util.Map;
import java.util.TreeMap;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class IdCardServlet extends HttpServlet {
	private static final long serialVersionUID = 4822041841146535386L;
	
	public IdCardServlet() {
		
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/plain");
		
		Map<String, String> certHeaderData = getRequestCertHeaderData(request);
		
		if(certHeaderData != null) {
			response.getWriter().write("ID code: " + certHeaderData.get("SERIALNUMBER") + "\n");
			response.getWriter().write("First name: " + certHeaderData.get("GIVENNAME") + "\n");
			response.getWriter().write("Last name: " + certHeaderData.get("SURNAME") + "\n");
		}
		else {
			response.getWriter().write("No certificate.\n");
		}
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}
	
	
	private Map<String, String> getRequestCertHeaderData(HttpServletRequest request) {
		Object certificateObjects = request.getAttribute("javax.servlet.request.X509Certificate");
		
		if(certificateObjects != null && certificateObjects instanceof X509Certificate[]) {
			X509Certificate certificates[] = (X509Certificate[])certificateObjects;
			
			if(certificates.length > 0) {
				X509Certificate certificate = certificates[0];
				
				Pattern pattern = Pattern.compile("((([a-zA-Z0-9]+)=(\"([^\"]*)\"|([^,]+)))(,)*)+");
				Matcher matcher = pattern.matcher(certificate.getSubjectDN().getName());
				
				Map<String, String> headerFields = new TreeMap<String, String>();
				
				while(matcher.find()) {
					headerFields.put(matcher.group(3), matcher.group(6) != null ? matcher.group(6) : matcher.group(5));
				}
				
				for(Entry<String, String> entry : headerFields.entrySet()) {
					System.out.println("Key: " + entry.getKey() + "      Value: " + entry.getValue());
				}
				
				return headerFields;
			}
		}

		return null;
	}
}
