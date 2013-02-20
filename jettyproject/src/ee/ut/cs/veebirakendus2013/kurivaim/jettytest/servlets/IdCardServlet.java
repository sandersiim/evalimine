package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.servlets;

import java.io.IOException;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.text.WordUtils;
import org.eclipse.jetty.server.SessionManager;

import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlConnectionHandler;
import ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql.MysqlQueryUserInfo;

public class IdCardServlet extends HttpServlet {
	private static final long serialVersionUID = 4822041841146535386L;
	
	private final MysqlConnectionHandler sqlHandler;
	private final SessionManager mainSessionManager;
	
	public IdCardServlet(MysqlConnectionHandler sqlHandler, SessionManager mainSessionManager) {
		this.sqlHandler = sqlHandler;
		this.mainSessionManager = mainSessionManager;
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/plain");
		
		String mainSessionId = request.getParameter("authSessionId");
		
		Map<String, String> certHeaderData = getRequestCertHeaderData(request);
		
		if(certHeaderData != null) {
			response.getWriter().write("ID code: " + certHeaderData.get("SERIALNUMBER") + "\n");
			response.getWriter().write("First name: " + certHeaderData.get("GIVENNAME") + "\n");
			response.getWriter().write("Last name: " + certHeaderData.get("SURNAME") + "\n");
		}
		else {
			response.getWriter().write("No certificate.\n");
		}
		
		String redirectParam = "#authSessionError";
		
		if(mainSessionId != null) {
			HttpSession mainSession = mainSessionManager.getHttpSession(mainSessionId);
			
			if(mainSession != null) {
				redirectParam = "#authCheckError";
				
				mainSession.removeAttribute("userId");
				mainSession.removeAttribute("firstName");
				mainSession.removeAttribute("lastName");
				mainSession.removeAttribute("authStatus");
				
				Object mainSessionIP = mainSession.getAttribute("remoteAddr");
				
				if(!request.getRemoteAddr().equals(mainSessionIP)) {
					mainSession.setAttribute("authStatus", "ERROR. IP address does not match.");
				}
				else if(certHeaderData == null) {
					mainSession.setAttribute("authStatus", "ERROR. No valid certificate.");
				}
				else {
					String idCode = certHeaderData.get("SERIALNUMBER");
					
					if(idCode == null) {
						mainSession.setAttribute("authStatus", "ERROR. Certificate doesn't specify ID code.");
					}
					else {
						if(!sqlHandler.validateConnection()) {
							mainSession.setAttribute("authStatus", "ERROR. Database connection failed.");
						}
						else {
							MysqlQueryUserInfo userInfo = new MysqlQueryUserInfo(sqlHandler).querySingleByUsername(idCode);
							boolean isNewAccount = false;
							
							if(userInfo == null) {
								int affected = -1;
								
								try {
									PreparedStatement statement = sqlHandler.getConnection().prepareStatement(
											"INSERT INTO ev_users SET username = ?, password = ?, voteRegionId = 0, votedCandidateId = 0");
									
									statement.setString(1, idCode);
									statement.setString(2, sqlHandler.getPasswordHash(new BigInteger(130, new SecureRandom()).toString(32)));
									affected = statement.executeUpdate();
								}
								catch(SQLException e) {
									e.printStackTrace(); //TODO: log this error
								}
								
								if(affected < 1) {
									mainSession.setAttribute("authStatus", "ERROR. Failed to create new account - query error.");
								}
								else {
									userInfo = new MysqlQueryUserInfo(sqlHandler).querySingleByUsername(idCode);
									
									if(userInfo == null) {
										mainSession.setAttribute("authStatus", "ERROR. Failed to query newly created account.");
									}
									else {
										isNewAccount = true;
									}
								}
							}
							
							if(userInfo != null) {
								redirectParam = "#authCheckSuccess";
								
								if(isNewAccount) {
									mainSession.setAttribute("authStatus", "SUCCESS. Successfully created an user and authenticated.");
								}
								else {
									mainSession.setAttribute("authStatus", "SUCCESS. Successfully authenticated.");
								}
								
								mainSession.setAttribute("userId", userInfo.getUserId());
								
								String firstName = certHeaderData.get("GIVENNAME"), lastName = certHeaderData.get("SURNAME");
								
								if(firstName != null && lastName != null) {
									mainSession.setAttribute("firstName", WordUtils.capitalizeFully(firstName, new char[] {'-', ' '}));
									mainSession.setAttribute("lastName", WordUtils.capitalizeFully(lastName, new char[] {'-', ' '}));
								}
							}
						}
					}
				}
				
				response.getWriter().write("Auth status: " + (String)mainSession.getAttribute("authStatus") + "\n");
			}
			else {
				response.getWriter().write("Main session not found ( " + mainSessionId + " ).\n");
			}
		}
		else {
			response.getWriter().write("Main session ID not specified.\n");
		}
		
		if(request.getParameter("noRedirect") == null) {
			response.sendRedirect("http://" + request.getServerName() + ":8080/querytest/" + redirectParam);
		}
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
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
				
				return headerFields;
			}
		}

		return null;
	}
}
