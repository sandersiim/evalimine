package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.query;

public class JsonQueryTypeSessionId implements JsonQueryInterface {
	
	@Override
	public JsonResponseInterface processQuery(JsonQueryInfo queryInfo) {
		queryInfo.getRequest().getSession().setAttribute("remoteAddr", queryInfo.getRequest().getRemoteAddr());
		
		return new JsonResponseTypeStatus(1, "sessionId", queryInfo.getRequest().getSession().getId());
	}
}
