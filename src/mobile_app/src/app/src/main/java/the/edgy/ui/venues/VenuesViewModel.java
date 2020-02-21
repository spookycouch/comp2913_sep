package the.edgy.ui.venues;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class VenuesViewModel extends ViewModel {

    private MutableLiveData<String> mText;

    public VenuesViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is venues fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}