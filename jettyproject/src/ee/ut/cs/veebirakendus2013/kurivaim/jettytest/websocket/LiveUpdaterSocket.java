package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.websocket;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketListener;

public class LiveUpdaterSocket implements WebSocketListener {
	
	protected LiveSocketHandler socketHandler;
	protected Session session;
	
	public LiveUpdaterSocket(LiveSocketHandler socketHandler) {
		this.socketHandler = socketHandler;
	}
	
	@Override
	public void onWebSocketConnect(Session session) {
		this.session = session;
		
		socketHandler.addToClientList(this);
	}
	
	@Override
	public void onWebSocketClose(int statusCode, String reason) {
		socketHandler.removeFromClientList(this);
	}
	
	@Override
	public void onWebSocketError(Throwable error) {
		
	}
	
	@Override
	public void onWebSocketBinary(byte[] payload, int offset, int len) {
		
	}
	
	@Override
	public void onWebSocketText(String message) {
		
	}
	
	public Session getSession() {
		return session;
	}
}
